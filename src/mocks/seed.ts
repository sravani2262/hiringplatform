import { Job, Candidate, Assessment, CandidateStage, TimelineEvent } from '@/lib/db';

const jobTitles = [
  'Senior Frontend Engineer',
  'Backend Developer',
  'Full Stack Engineer',
  'Product Manager',
  'UI/UX Designer',
  'DevOps Engineer',
  'Data Scientist',
  'Machine Learning Engineer',
  'QA Engineer',
  'Engineering Manager',
  'Technical Lead',
  'Mobile Developer',
  'Site Reliability Engineer',
  'Security Engineer',
  'Sales Manager',
  'Marketing Manager',
  'Customer Success Manager',
  'HR Manager',
  'Finance Manager',
  'Operations Manager',
  'Content Writer',
  'Social Media Manager',
  'Business Analyst',
  'Scrum Master',
  'Cloud Architect',
];

const tags = [
  'Remote',
  'On-site',
  'Hybrid',
  'Full-time',
  'Contract',
  'Senior',
  'Mid-level',
  'Junior',
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
];

const firstNames = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia', 'James',
  'Isabella', 'Oliver', 'Charlotte', 'Benjamin', 'Amelia', 'Elijah', 'Mia',
  'Lucas', 'Harper', 'Mason', 'Evelyn', 'Logan', 'Abigail', 'Alexander',
  'Emily', 'Ethan', 'Elizabeth', 'Jacob', 'Sofia', 'Michael', 'Avery',
  'Daniel', 'Ella', 'Henry', 'Scarlett', 'Jackson', 'Grace', 'Sebastian',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
  'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark',
];

const stages: CandidateStage[] = ['applied', 'screen', 'tech', 'offer', 'hired', 'rejected'];

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function generateJobs(): Job[] {
  const jobs: Job[] = [];
  const now = new Date().toISOString();

  for (let i = 0; i < 25; i++) {
    const title = jobTitles[i];
    const randomTags = tags
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 4) + 2);

    jobs.push({
      id: `job-${i + 1}`,
      title,
      slug: generateSlug(title),
      status: Math.random() > 0.3 ? 'active' : 'archived',
      tags: randomTags,
      order: i,
      description: `We are looking for an exceptional ${title} to join our team.`,
      location: ['Remote', 'San Francisco, CA', 'New York, NY', 'Austin, TX'][Math.floor(Math.random() * 4)],
      type: ['Full-time', 'Contract', 'Part-time'][Math.floor(Math.random() * 3)],
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: now,
    });
  }

  return jobs;
}

export function generateCandidates(jobs: Job[]): Candidate[] {
  const candidates: Candidate[] = [];
  const now = new Date().toISOString();

  for (let i = 0; i < 1000; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
    const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
    const stage = stages[Math.floor(Math.random() * stages.length)];

    candidates.push({
      id: `candidate-${i + 1}`,
      name,
      email,
      stage,
      jobId: randomJob.id,
      phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: now,
    });
  }

  return candidates;
}

export function generateTimeline(candidates: Candidate[]): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  let eventId = 1;

  for (const candidate of candidates) {
    // Initial application
    events.push({
      id: `event-${eventId++}`,
      candidateId: candidate.id,
      type: 'stage_change',
      toStage: 'applied',
      timestamp: candidate.createdAt,
      userName: 'System',
    });

    // Random stage progressions
    const currentStageIndex = stages.indexOf(candidate.stage);
    for (let i = 1; i <= currentStageIndex; i++) {
      events.push({
        id: `event-${eventId++}`,
        candidateId: candidate.id,
        type: 'stage_change',
        fromStage: stages[i - 1],
        toStage: stages[i],
        timestamp: new Date(new Date(candidate.createdAt).getTime() + i * 7 * 24 * 60 * 60 * 1000).toISOString(),
        userName: ['HR Manager', 'Tech Lead', 'Engineering Manager'][Math.floor(Math.random() * 3)],
      });
    }
  }

  return events;
}

export function generateAssessments(jobs: Job[]): Assessment[] {
  const assessments: Assessment[] = [];
  const questionTypes = ['single-choice', 'multi-choice', 'short-text', 'long-text', 'numeric', 'file'] as const;

  // Create assessments for first 3 active jobs
  const activeJobs = jobs.filter(j => j.status === 'active').slice(0, 3);

  activeJobs.forEach((job, jobIndex) => {
    const sections: Assessment['sections'] = [];

    for (let i = 0; i < 3; i++) {
      const questions = [];
      
      for (let q = 0; q < 4; q++) {
        const type = questionTypes[Math.floor(Math.random() * questionTypes.length)];
        const question: any = {
          id: `q-${jobIndex}-${i}-${q}`,
          type,
          text: `Question ${q + 1} for section ${i + 1}`,
          description: 'Please provide a detailed answer.',
          required: Math.random() > 0.3,
        };

        if (type === 'single-choice' || type === 'multi-choice') {
          question.options = ['Option A', 'Option B', 'Option C', 'Option D'];
        }

        if (type === 'numeric') {
          question.validation = { min: 0, max: 100 };
        }

        if (type === 'short-text') {
          question.validation = { maxLength: 100 };
        }

        if (type === 'long-text') {
          question.validation = { maxLength: 1000 };
        }

        // Add conditional logic to some questions
        if (q > 0 && Math.random() > 0.7) {
          question.conditionalOn = {
            questionId: questions[q - 1].id,
            value: 'Option A',
          };
        }

        questions.push(question);
      }

      sections.push({
        id: `section-${jobIndex}-${i}`,
        title: `Section ${i + 1}`,
        description: `This section covers ${['Technical Skills', 'Experience', 'Cultural Fit'][i]}`,
        questions,
      });
    }

    assessments.push({
      id: `assessment-${jobIndex + 1}`,
      jobId: job.id,
      title: `${job.title} Assessment`,
      description: 'Complete this assessment to proceed with your application.',
      sections,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    });
  });

  return assessments;
}
