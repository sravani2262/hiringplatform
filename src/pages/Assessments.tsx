import { Layout } from '@/components/Layout';
import { AssessmentBuilder } from '@/components/assessments/AssessmentBuilder';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ClipboardCheck, FileQuestion } from 'lucide-react';

export default function Assessments() {
  const { data: jobsResponse } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const res = await fetch('/api/jobs?pageSize=100&status=active');
      return res.json();
    },
  });

  const activeJobs = jobsResponse?.data?.filter((j: any) => j.status === 'active') || [];

  return (
    <Layout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Assessments</h1>
          <p className="text-muted-foreground">Create and manage job-specific assessments and quizzes</p>
        </div>

        {activeJobs.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileQuestion className="h-5 w-5" />
                No Active Jobs
              </CardTitle>
              <CardDescription>
                You need to create active jobs before building assessments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/jobs" className="text-primary hover:underline">
                Create a job →
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {activeJobs.map((job: any) => (
                <AssessmentBuilder key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
