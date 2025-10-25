import { Layout } from '@/components/Layout';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Edit } from 'lucide-react';
import { Job } from '@/lib/db';

export default function JobDetail() {
  const { jobId } = useParams();

  const { data: jobsResponse } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const res = await fetch('/api/jobs?pageSize=100');
      return res.json();
    },
  });

  const job = jobsResponse?.data?.find((j: Job) => j.id === jobId);

  const { data: candidatesResponse } = useQuery({
    queryKey: ['candidates', jobId],
    queryFn: async () => {
      const res = await fetch('/api/candidates?pageSize=1000');
      const data = await res.json();
      return {
        ...data,
        data: data.data.filter((c: any) => c.jobId === jobId),
      };
    },
    enabled: !!jobId,
  });

  if (!job) {
    return (
      <Layout>
        <div className="p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Job not found</h2>
            <Link to="/jobs">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Jobs
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        <Link to="/jobs">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Button>
        </Link>

        <div className="mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
              <div className="flex gap-2 flex-wrap">
                <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                  {job.status}
                </Badge>
                {job.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Edit Job
              </Button>
              <Button variant="outline">
                <Users className="mr-2 h-4 w-4" />
                View Candidates
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Location</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">{job.location || 'Not specified'}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Type</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">{job.type || 'Not specified'}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">Applicants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <p className="text-lg font-semibold">{candidatesResponse?.data?.length || 0}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {job.description || 'No description provided.'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Applicants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {candidatesResponse?.data?.slice(0, 5).map((candidate: any) => (
                  <div key={candidate.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">
                          {candidate.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{candidate.name}</p>
                        <p className="text-xs text-muted-foreground">{candidate.email}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {candidate.stage}
                    </Badge>
                  </div>
                ))}
                {candidatesResponse?.data?.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">No applicants yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
