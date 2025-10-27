import { Layout } from '@/components/Layout';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, Phone, Briefcase } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { CandidateNotes } from '@/components/candidates/CandidateNotes';

export default function CandidateDetail() {
  const { id } = useParams();

  const { data: candidatesResponse } = useQuery({
    queryKey: ['candidates'],
    queryFn: async () => {
      const res = await fetch('/api/candidates?pageSize=1000');
      return res.json();
    },
  });

  const candidate = candidatesResponse?.data?.find((c: any) => c.id === id);

  const { data: timeline } = useQuery({
    queryKey: ['timeline', id],
    queryFn: async () => {
      const res = await fetch(`/api/candidates/${id}/timeline`);
      return res.json();
    },
    enabled: !!id,
  });

  const { data: jobsResponse } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const res = await fetch('/api/jobs?pageSize=100');
      return res.json();
    },
  });

  const job = jobsResponse?.data?.find((j: any) => j.id === candidate?.jobId);

  const stageColors: Record<string, string> = {
    applied: 'bg-status-applied',
    screen: 'bg-status-screen',
    tech: 'bg-status-tech',
    offer: 'bg-status-offer',
    hired: 'bg-status-hired',
    rejected: 'bg-status-rejected',
  };

  if (!candidate) {
    return (
      <Layout>
        <div className="p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Candidate not found</h2>
            <Link to="/candidates">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Candidates
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
        <Link to="/candidates">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Candidates
          </Button>
        </Link>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column - Candidate info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{candidate.name}</CardTitle>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Mail className="h-4 w-4" />
                        {candidate.email}
                      </div>
                      {candidate.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="h-4 w-4" />
                          {candidate.phone}
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge className={stageColors[candidate.stage]}>
                    {candidate.stage}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Applied for:</span>
                  <Link to={`/jobs/${job?.id}`} className="font-medium text-primary hover:underline">
                    {job?.title || 'Unknown Position'}
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {timeline?.map((event: any) => (
                    <div key={event.id} className="flex gap-4">
                      <div className="relative flex flex-col items-center">
                        <div className={`h-3 w-3 rounded-full ${stageColors[event.toStage || 'applied']}`} />
                        {timeline.indexOf(event) < timeline.length - 1 && (
                          <div className="w-0.5 flex-1 bg-border mt-1" />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium">
                            {event.type === 'stage_change' && (
                              <>
                                {event.fromStage && `${event.fromStage} → `}
                                {event.toStage}
                              </>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">by {event.userName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes with @mentions */}
            <CandidateNotes candidateId={id!} />
          </div>

          {/* Right column - Actions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline" size="sm">
                  Schedule Interview
                </Button>
                <Button className="w-full" variant="outline" size="sm">
                  Add Note
                </Button>
                <Button className="w-full" variant="outline" size="sm">
                  Send Email
                </Button>
                <Button className="w-full" variant="outline" size="sm">
                  Download Resume
                </Button>
                <Button className="w-full" variant="destructive" size="sm">
                  Reject Candidate
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Applied</p>
                  <p className="font-medium">
                    {formatDistanceToNow(new Date(candidate.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Updated</p>
                  <p className="font-medium">
                    {formatDistanceToNow(new Date(candidate.updatedAt), { addSuffix: true })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
