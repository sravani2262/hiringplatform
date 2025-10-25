import { http, HttpResponse, delay } from 'msw';
import { db } from '@/lib/db';
import { generateJobs, generateCandidates, generateTimeline, generateAssessments } from './seed';

// Artificial latency and error simulation
async function simulateNetwork() {
  const latency = Math.random() * 1000 + 200; // 200-1200ms
  await delay(latency);
  
  // 5-10% error rate on write operations
  if (Math.random() < 0.075) {
    throw new Error('Network error');
  }
}

// Initialize database with seed data
async function initializeDB() {
  const jobCount = await db.jobs.count();
  if (jobCount === 0) {
    const jobs = generateJobs();
    const candidates = generateCandidates(jobs);
    const timeline = generateTimeline(candidates);
    const assessments = generateAssessments(jobs);

    await db.jobs.bulkAdd(jobs);
    await db.candidates.bulkAdd(candidates);
    await db.timeline.bulkAdd(timeline);
    await db.assessments.bulkAdd(assessments);
  }
}

// Initialize DB on module load
initializeDB();

export const handlers = [
  // Jobs endpoints
  http.get('/api/jobs', async ({ request }) => {
    await simulateNetwork();
    
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const status = url.searchParams.get('status') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');
    const sort = url.searchParams.get('sort') || 'order';

    let jobs = await db.jobs.toArray();

    // Filter
    if (search) {
      const searchLower = search.toLowerCase().trim();
      jobs = jobs.filter(job => 
        job.title.toLowerCase().includes(searchLower) ||
        job.location.toLowerCase().includes(searchLower) ||
        job.type.toLowerCase().includes(searchLower) ||
        job.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    if (status) {
      jobs = jobs.filter(job => job.status === status);
    }

    // Sort
    jobs.sort((a, b) => {
      if (sort === 'order') return a.order - b.order;
      if (sort === 'title') return a.title.localeCompare(b.title);
      if (sort === 'createdAt') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return 0;
    });

    // Paginate
    const total = jobs.length;
    const start = (page - 1) * pageSize;
    const paginatedJobs = jobs.slice(start, start + pageSize);

    return HttpResponse.json({
      data: paginatedJobs,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  }),

  http.post('/api/jobs', async ({ request }) => {
    await simulateNetwork();
    
    const body = await request.json() as any;
    const newJob = {
      ...body,
      id: `job-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.jobs.add(newJob);
    return HttpResponse.json(newJob, { status: 201 });
  }),

  http.patch('/api/jobs/:id', async ({ params, request }) => {
    await simulateNetwork();
    
    const { id } = params;
    const updates = await request.json() as any;
    
    await db.jobs.update(id as string, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    const updated = await db.jobs.get(id as string);
    return HttpResponse.json(updated);
  }),

  http.patch('/api/jobs/:id/reorder', async ({ params, request }) => {
    await simulateNetwork();
    
    const { id } = params;
    const { fromOrder, toOrder } = await request.json() as any;

    const jobs = await db.jobs.orderBy('order').toArray();
    const job = jobs.find(j => j.id === id);
    
    if (!job) {
      return new HttpResponse(null, { status: 404 });
    }

    // Update orders
    const updates = jobs.map(j => {
      if (j.id === id) {
        return { ...j, order: toOrder };
      }
      if (fromOrder < toOrder) {
        if (j.order > fromOrder && j.order <= toOrder) {
          return { ...j, order: j.order - 1 };
        }
      } else {
        if (j.order >= toOrder && j.order < fromOrder) {
          return { ...j, order: j.order + 1 };
        }
      }
      return j;
    });

    await db.jobs.bulkPut(updates);
    return HttpResponse.json({ success: true });
  }),

  // Candidates endpoints
  http.get('/api/candidates', async ({ request }) => {
    await simulateNetwork();
    
    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const stage = url.searchParams.get('stage') || '';
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '50');

    let candidates = await db.candidates.toArray();

    // Filter
    if (search) {
      const searchLower = search.toLowerCase();
      candidates = candidates.filter(c => 
        c.name.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower)
      );
    }
    if (stage) {
      candidates = candidates.filter(c => c.stage === stage);
    }

    // Sort by creation date (newest first)
    candidates.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Paginate
    const total = candidates.length;
    const start = (page - 1) * pageSize;
    const paginatedCandidates = candidates.slice(start, start + pageSize);

    return HttpResponse.json({
      data: paginatedCandidates,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  }),

  http.post('/api/candidates', async ({ request }) => {
    await simulateNetwork();
    
    const body = await request.json() as any;
    const newCandidate = {
      ...body,
      id: `candidate-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.candidates.add(newCandidate);
    
    // Add timeline event
    await db.timeline.add({
      id: `event-${Date.now()}`,
      candidateId: newCandidate.id,
      type: 'stage_change',
      toStage: newCandidate.stage,
      timestamp: new Date().toISOString(),
      userName: 'System',
    });

    return HttpResponse.json(newCandidate, { status: 201 });
  }),

  http.patch('/api/candidates/:id', async ({ params, request }) => {
    await simulateNetwork();
    
    const { id } = params;
    const updates = await request.json() as any;
    
    const candidate = await db.candidates.get(id as string);
    if (!candidate) {
      return new HttpResponse(null, { status: 404 });
    }

    // If stage changed, add timeline event
    if (updates.stage && updates.stage !== candidate.stage) {
      await db.timeline.add({
        id: `event-${Date.now()}`,
        candidateId: id as string,
        type: 'stage_change',
        fromStage: candidate.stage,
        toStage: updates.stage,
        timestamp: new Date().toISOString(),
        userName: 'HR Manager',
      });
    }

    await db.candidates.update(id as string, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    const updated = await db.candidates.get(id as string);
    return HttpResponse.json(updated);
  }),

  http.get('/api/candidates/:id/timeline', async ({ params }) => {
    await simulateNetwork();
    
    const { id } = params;
    const events = await db.timeline
      .where('candidateId')
      .equals(id as string)
      .reverse()
      .sortBy('timestamp');

    return HttpResponse.json(events);
  }),

  // Assessments endpoints
  http.get('/api/assessments', async () => {
    await simulateNetwork();
    
    const assessments = await db.assessments.toArray();
    return HttpResponse.json(assessments);
  }),

  http.get('/api/assessments/:jobId', async ({ params }) => {
    await simulateNetwork();
    
    const { jobId } = params;
    const assessment = await db.assessments
      .where('jobId')
      .equals(jobId as string)
      .first();

    if (!assessment) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(assessment);
  }),

  http.put('/api/assessments/:jobId', async ({ params, request }) => {
    await simulateNetwork();
    
    const { jobId } = params;
    const body = await request.json() as any;

    const existing = await db.assessments
      .where('jobId')
      .equals(jobId as string)
      .first();

    if (existing) {
      await db.assessments.update(existing.id, {
        ...body,
        updatedAt: new Date().toISOString(),
      });
      const updated = await db.assessments.get(existing.id);
      return HttpResponse.json(updated);
    } else {
      const newAssessment = {
        ...body,
        id: `assessment-${Date.now()}`,
        jobId: jobId as string,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await db.assessments.add(newAssessment);
      return HttpResponse.json(newAssessment, { status: 201 });
    }
  }),

  http.post('/api/assessments/:jobId/submit', async ({ params, request }) => {
    await simulateNetwork();
    
    const { jobId } = params;
    const body = await request.json() as any;

    const response = {
      id: `response-${Date.now()}`,
      assessmentId: body.assessmentId,
      candidateId: body.candidateId,
      responses: body.responses,
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await db.assessmentResponses.add(response);
    return HttpResponse.json(response, { status: 201 });
  }),
];
