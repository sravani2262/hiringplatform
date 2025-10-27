import { Layout } from '@/components/Layout';
import { EnhancedAssessmentBuilder } from '@/components/assessments/EnhancedAssessmentBuilder';
import { ResponseViewer } from '@/components/assessments/ResponseViewer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ClipboardCheck, FileQuestion, AlertCircle, Plus, Edit, Eye, Play, Target, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (previousData) => previousData,
  });

  const { data: assessmentsResponse, isLoading: assessmentsLoading } = useQuery({
    queryKey: ['assessments'],
    queryFn: async () => {
      const res = await fetch('/api/assessments');
      if (!res.ok) throw new Error('Failed to fetch assessments');
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    placeholderData: (previousData) => previousData,
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
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 sm:mb-8">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-80" />
          </div>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-20 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 container-responsive">
        {/* Enhanced Header Section */}
        <div className="relative mb-16 text-center pt-8">
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-radial from-emerald-400/8 via-blue-400/4 to-transparent pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-emerald-400/15 to-blue-400/15 rounded-full blur-3xl opacity-30" />
          
          {/* Header content */}
          <div className="relative mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-emerald-400/20 mb-6">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-medium text-slate-600">Assessment Center</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 gradient-text-rainbow tracking-tight">
              Assessments
            </h1>
            
            <p className="text-slate-600 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
              Create intelligent assessments and evaluate candidates with precision
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/assessments/demo">
                <Button 
                  variant="outline" 
                  className="group relative gap-3 px-6 py-3 text-base font-semibold rounded-2xl border-2 border-emerald-400/30 hover:border-emerald-400 hover:bg-emerald-400/10 hover:-translate-y-1 transition-all duration-300"
                >
                  <Play className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="relative">Try Demo</span>
                </Button>
              </Link>
              
              <Link to="/jobs">
                <Button 
                  className="group relative gap-3 px-6 py-3 text-base font-semibold rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-emerald-400/30 hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-emerald-500 to-blue-500 border-none"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="relative">Create Job</span>
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent rounded-full" />
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full" />
        </div>

        {/* Enhanced Summary Cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-12">
          <Card className="group card-premium hover-lift hover-glow border-none shadow-lg rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/50 to-white group-hover:from-blue-50 group-hover:via-blue-100/30 group-hover:to-blue-50/50 transition-all duration-500" />
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-emerald-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  Total Jobs
                </CardTitle>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                  {allJobs.length}
                </div>
              </div>
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg bg-blue-100 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Briefcase className="h-7 w-7 text-blue-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg" />
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700 border-blue-200">
                    {activeJobs.length} active
                  </Badge>
                  <span className="text-xs text-slate-500 font-medium">
                    {allJobs.length - activeJobs.length} archived
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="group card-premium hover-lift hover-glow border-none shadow-lg rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-emerald-50/50 to-white group-hover:from-emerald-50 group-hover:via-emerald-100/30 group-hover:to-emerald-50/50 transition-all duration-500" />
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  Assessments
                </CardTitle>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors duration-300">
                  {assessments.length}
                </div>
              </div>
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg bg-emerald-100 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <ClipboardCheck className="h-7 w-7 text-emerald-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg" />
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 border-emerald-200">
                    {assessments.length > 0 ? 'Ready' : 'None yet'}
                  </Badge>
                  <span className="text-xs text-slate-500 font-medium">
                    for candidates
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="group card-premium hover-lift hover-glow border-none shadow-lg rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-purple-50/50 to-white group-hover:from-purple-50 group-hover:via-purple-100/30 group-hover:to-purple-50/50 transition-all duration-500" />
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-emerald-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  Active Jobs
                </CardTitle>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 group-hover:text-purple-600 transition-colors duration-300">
                  {activeJobs.length}
                </div>
              </div>
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg bg-purple-100 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Target className="h-7 w-7 text-purple-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg" />
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-700 border-purple-200">
                    {activeJobs.length > 0 ? 'Ready to assess' : 'Create jobs first'}
                  </Badge>
                </div>
              </div>
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
