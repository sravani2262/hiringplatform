import { Layout } from '@/components/Layout';
import { EnhancedAssessmentBuilder } from '@/components/assessments/EnhancedAssessmentBuilder';
import { ResponseViewer } from '@/components/assessments/ResponseViewer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ClipboardCheck, FileQuestion, AlertCircle, Plus, Edit, Eye, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function Assessments() {
  const [editAssessmentOpen, setEditAssessmentOpen] = useState(false);
  const [viewResponsesOpen, setViewResponsesOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);

  const { data: jobsResponse, isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const res = await fetch('/api/jobs?pageSize=100');
      return res.json();
    },
  });

  const { data: assessmentsResponse, isLoading: assessmentsLoading } = useQuery({
    queryKey: ['assessments'],
    queryFn: async () => {
      const res = await fetch('/api/assessments');
      if (!res.ok) throw new Error('Failed to fetch assessments');
      return res.json();
    },
  });

  const activeJobs = jobsResponse?.data?.filter((j: any) => j.status === 'active') || [];
  const allJobs = jobsResponse?.data || [];

  // Mock assessments data with sample content
  const mockAssessments = [
    {
      id: 'assessment-1',
      jobId: activeJobs[0]?.id || 'job-1',
      title: `${activeJobs[0]?.title || 'Frontend Developer'} Assessment`,
      description: 'Complete this comprehensive assessment to demonstrate your skills and qualifications.',
      sections: [
        {
          id: 'section-1',
          title: 'Technical Skills',
          description: 'Questions about your technical background and experience',
          questions: [
            {
              id: 'q-1',
              type: 'single-choice',
              text: 'What is your experience level with React?',
              options: ['Beginner (0-1 years)', 'Intermediate (1-3 years)', 'Advanced (3-5 years)', 'Expert (5+ years)'],
              validation: { required: true },
            },
            {
              id: 'q-2',
              type: 'multi-choice',
              text: 'Which technologies are you familiar with?',
              options: ['TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL', 'Redux'],
              validation: { required: true, minLength: 2 },
            },
            {
              id: 'q-3',
              type: 'long-text',
              text: 'Describe a challenging technical problem you solved recently',
              validation: { required: true, minLength: 100 },
            },
          ],
        },
        {
          id: 'section-2',
          title: 'Problem Solving',
          description: 'Scenario-based questions to assess your approach',
          questions: [
            {
              id: 'q-4',
              type: 'single-choice',
              text: 'How do you approach debugging a complex issue?',
              options: [
                'Start with console.log statements',
                'Use browser dev tools and breakpoints',
                'Write unit tests to isolate the problem',
                'Ask team members for help immediately',
              ],
              validation: { required: true },
            },
          ],
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
    },
  ];

  const assessments = assessmentsResponse?.length > 0 ? assessmentsResponse : mockAssessments;

  const handleEditAssessment = (assessment: any) => {
    setSelectedAssessment(assessment);
    setEditAssessmentOpen(true);
  };

  const handleViewResponses = (assessment: any) => {
    setSelectedAssessment(assessment);
    setViewResponsesOpen(true);
  };

  // Mock responses data - in a real app, this would come from an API
  const mockResponses = [
    {
      id: 'resp-1',
      assessmentId: selectedAssessment?.id || '',
      candidateName: 'John Doe',
      candidateEmail: 'john@example.com',
      responses: [
        { questionId: 'q-1', value: '3+ years', timestamp: new Date().toISOString() },
        { questionId: 'q-2', value: 'I have extensive experience with TypeScript', timestamp: new Date().toISOString() },
      ],
      startedAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date().toISOString(),
      status: 'completed' as const,
    },
    {
      id: 'resp-2',
      assessmentId: selectedAssessment?.id || '',
      candidateName: 'Jane Smith',
      candidateEmail: 'jane@example.com',
      responses: [
        { questionId: 'q-1', value: '1-3 years', timestamp: new Date().toISOString() },
        { questionId: 'q-2', value: 'Some experience with TypeScript', timestamp: new Date().toISOString() },
      ],
      startedAt: new Date(Date.now() - 1800000).toISOString(),
      status: 'in-progress' as const,
    },
  ];

  if (jobsLoading || assessmentsLoading) {
    return (
      <Layout>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Assessments</h1>
            <p className="text-muted-foreground">Create and manage job-specific assessments and quizzes</p>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-32 animate-pulse bg-muted" />
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Assessments</h1>
            <p className="text-muted-foreground text-sm sm:text-base">Create and manage job-specific assessments and quizzes</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Link to="/assessments/demo" className="w-full sm:w-auto">
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <Play className="h-4 w-4" />
                Try Demo
              </Button>
            </Link>
            <Link to="/jobs" className="w-full sm:w-auto">
              <Button className="gap-2 w-full sm:w-auto">
                <Plus className="h-4 w-4" />
                Create Job
              </Button>
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allJobs.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeJobs.length} active, {allJobs.length - activeJobs.length} archived
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Assessments Created</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assessments.length}</div>
              <p className="text-xs text-muted-foreground">
                {assessments.length > 0 ? 'Ready for candidates' : 'No assessments yet'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeJobs.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeJobs.length > 0 ? 'Can create assessments' : 'Create jobs first'}
              </p>
            </CardContent>
          </Card>
        </div>

        {activeJobs.length === 0 ? (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-warning" />
                No Active Jobs Available
              </CardTitle>
              <CardDescription>
                You need to create active jobs before building assessments. Assessments can only be created for jobs that are currently accepting applications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Link to="/jobs">
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Create Your First Job
                  </Button>
                </Link>
                <Link to="/jobs">
                  <Button variant="outline" className="gap-2">
                    <ClipboardCheck className="h-4 w-4" />
                    Manage Jobs
                  </Button>
                </Link>
              </div>
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-1">Why do I need active jobs?</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Assessments are linked to specific job positions</li>
                  <li>Only active jobs can receive new applications</li>
                  <li>Candidates take assessments as part of the application process</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Existing Assessments */}
            {assessments.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <ClipboardCheck className="h-5 w-5" />
                  Existing Assessments ({assessments.length})
                </h2>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6">
                  {assessments.map((assessment: any) => {
                    const job = allJobs.find((j: any) => j.id === assessment.jobId);
                    return (
                      <Card key={assessment.id} className="border-l-4 border-l-primary">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{job?.title || 'Unknown Job'}</CardTitle>
                              <CardDescription className="flex items-center gap-2 mt-1">
                                <ClipboardCheck className="h-4 w-4" />
                                <span>{assessment.sections?.length || 0} sections</span>
                              </CardDescription>
                            </div>
                            <Badge variant="default">Active</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-3">
                            {assessment.description || 'No description provided'}
                          </p>
                          <div className="flex gap-2 items-center w-full">
                            <Button 
                              size="sm" 
                              className="flex-1 h-8 min-w-0"
                              onClick={() => handleEditAssessment(assessment)}
                            >
                              <Edit className="h-3 w-3 mr-1" />
                              Edit Assessment
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="flex-1 h-8 min-w-0"
                              onClick={() => handleViewResponses(assessment)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View Responses
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Assessment Builder */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <FileQuestion className="h-5 w-5" />
                Create New Assessments
              </h2>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck className="h-5 w-5" />
                    Assessment Builder
                  </CardTitle>
                  <CardDescription>
                    Select a job below to create or edit its assessment
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4">
                {activeJobs.map((job: any) => {
                  const hasAssessment = assessments.some((a: any) => a.jobId === job.id);
                  return (
                    <EnhancedAssessmentBuilder 
                      key={job.id} 
                      job={job} 
                      hasAssessment={hasAssessment}
                      onSave={(assessment) => {
                        // Refresh assessments data
                        window.location.reload();
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Edit Assessment Dialog */}
        <Dialog open={editAssessmentOpen} onOpenChange={setEditAssessmentOpen}>
          <DialogContent className="max-w-7xl max-h-[95vh]">
            <DialogHeader>
              <DialogTitle>
                Edit Assessment - {selectedAssessment && allJobs.find((j: any) => j.id === selectedAssessment.jobId)?.title}
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
              {selectedAssessment && (
                <EnhancedAssessmentBuilder
                  job={allJobs.find((j: any) => j.id === selectedAssessment.jobId)}
                  hasAssessment={true}
                  onSave={(assessment) => {
                    setEditAssessmentOpen(false);
                    // Refresh assessments data
                    window.location.reload();
                  }}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* View Responses Dialog */}
        <Dialog open={viewResponsesOpen} onOpenChange={setViewResponsesOpen}>
          <DialogContent className="max-w-7xl max-h-[95vh]">
            <DialogHeader>
              <DialogTitle>
                Assessment Responses - {selectedAssessment && allJobs.find((j: any) => j.id === selectedAssessment.jobId)?.title}
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-y-auto max-h-[calc(95vh-120px)]">
              {selectedAssessment && (
                <ResponseViewer 
                  assessment={selectedAssessment} 
                  responses={mockResponses.filter(r => r.assessmentId === selectedAssessment.id)}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>

      </div>
    </Layout>
  );
}
