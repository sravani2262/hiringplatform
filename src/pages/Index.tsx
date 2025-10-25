import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, Users, ClipboardCheck, TrendingUp, Calendar, Target, Award, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';

export default function Index() {
  const { data: jobs } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const res = await fetch('/api/jobs?pageSize=100');
      return res.json();
    },
  });

  const { data: candidates } = useQuery({
    queryKey: ['candidates'],
    queryFn: async () => {
      const res = await fetch('/api/candidates?pageSize=1000');
      return res.json();
    },
  });

  const stats = [
    {
      title: 'Active Jobs',
      value: jobs?.data?.filter((j: any) => j.status === 'active').length || 0,
      icon: Briefcase,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: '+12%',
      changeType: 'positive',
    },
    {
      title: 'Total Candidates',
      value: candidates?.data?.length || 0,
      icon: Users,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      change: '+8%',
      changeType: 'positive',
    },
    {
      title: 'In Progress',
      value: candidates?.data?.filter((c: any) => ['screen', 'tech', 'offer'].includes(c.stage)).length || 0,
      icon: ClipboardCheck,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      change: '+5%',
      changeType: 'positive',
    },
    {
      title: 'Hired This Month',
      value: candidates?.data?.filter((c: any) => c.stage === 'hired').length || 0,
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/10',
      change: '+15%',
      changeType: 'positive',
    },
  ];

  // Calculate conversion rates
  const totalCandidates = candidates?.data?.length || 0;
  const hiredCandidates = candidates?.data?.filter((c: any) => c.stage === 'hired').length || 0;
  const conversionRate = totalCandidates > 0 ? Math.round((hiredCandidates / totalCandidates) * 100) : 0;

  // Recent activity data
  const recentCandidates = candidates?.data?.slice(0, 5) || [];
  const recentJobs = jobs?.data?.slice(0, 3) || [];

  return (
    <Layout>
      <div className="p-8 animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">Welcome to TalentFlow - Your hiring command center</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={stat.title} 
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-primary/30 hover:border-t-primary group overflow-hidden relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={cn('h-10 w-10 rounded-full flex items-center justify-center', stat.bgColor, 'group-hover:scale-110 transition-transform')}>
                    <Icon className={cn('h-5 w-5', stat.color)} />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant={stat.changeType === 'positive' ? 'default' : 'destructive'} className="text-xs">
                      {stat.change}
                    </Badge>
                    <span className="text-xs text-muted-foreground">vs last month</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
              <CardHeader className="relative">
                <CardTitle className="text-2xl">Quick Actions</CardTitle>
                <CardDescription className="text-base">Common tasks to manage your hiring pipeline</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 relative">
                <Link
                  to="/jobs"
                  className="group flex items-center gap-4 rounded-xl border-2 p-5 transition-all hover:border-primary hover:shadow-xl hover:-translate-y-1 hover:bg-primary/5"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:scale-110 transition-transform">
                    <Briefcase className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-base">Manage Jobs</p>
                    <p className="text-sm text-muted-foreground">Create and edit positions</p>
                  </div>
                </Link>

                <Link
                  to="/candidates"
                  className="group flex items-center gap-4 rounded-xl border-2 p-5 transition-all hover:border-accent hover:shadow-xl hover:-translate-y-1 hover:bg-accent/5"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent/20 to-accent/10 group-hover:scale-110 transition-transform">
                    <Users className="h-7 w-7 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-base">View Candidates</p>
                    <p className="text-sm text-muted-foreground">Track applicant progress</p>
                  </div>
                </Link>

                <Link
                  to="/assessments"
                  className="group flex items-center gap-4 rounded-xl border-2 p-5 transition-all hover:border-warning hover:shadow-xl hover:-translate-y-1 hover:bg-warning/5"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-warning/20 to-warning/10 group-hover:scale-110 transition-transform">
                    <ClipboardCheck className="h-7 w-7 text-warning" />
                  </div>
                  <div>
                    <p className="font-semibold text-base">Assessments</p>
                    <p className="text-sm text-muted-foreground">Build and manage tests</p>
                  </div>
                </Link>

                <Link
                  to="/candidates"
                  className="group flex items-center gap-4 rounded-xl border-2 p-5 transition-all hover:border-success hover:shadow-xl hover:-translate-y-1 hover:bg-success/5"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-success/20 to-success/10 group-hover:scale-110 transition-transform">
                    <Award className="h-7 w-7 text-success" />
                  </div>
                  <div>
                    <p className="font-semibold text-base">Analytics</p>
                    <p className="text-sm text-muted-foreground">View hiring metrics</p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Conversion Rate</CardTitle>
                <CardDescription>Hiring success rate</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{conversionRate}%</span>
                    <Target className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Progress value={conversionRate} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {hiredCandidates} of {totalCandidates} candidates hired
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <CardDescription>Latest updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentCandidates.slice(0, 3).map((candidate: any) => (
                    <div key={candidate.id} className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{candidate.name}</p>
                        <p className="text-xs text-muted-foreground">{candidate.stage}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {candidate.stage}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Jobs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Job Postings</CardTitle>
            <CardDescription>Your latest job openings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recentJobs.map((job: any) => (
                <Link key={job.id} to={`/jobs/${job.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-base">{job.title}</h3>
                        <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                          {job.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{job.location}</p>
                      <div className="flex gap-1 flex-wrap">
                        {job.tags.slice(0, 2).map((tag: string) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

function cn(...args: any[]) {
  return args.filter(Boolean).join(' ');
}
