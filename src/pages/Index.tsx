import { Layout } from '@/components/Layout';
import { PageContainer } from '@/components/PageContainer';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Briefcase,
  Users,
  ClipboardCheck,
  TrendingUp,
  Target,
  Award,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function Index() {
  const { data: jobs, isLoading: jobsLoading, error: jobsError } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/jobs?pageSize=100');
        if (!res.ok) {
          throw new Error('Failed to fetch jobs');
        }
        return res.json();
      } catch (error) {
        console.error('Jobs API error:', error);
        // Return fallback data
        return {
          data: [
            {
              id: 'job-1',
              title: 'Frontend Developer',
              status: 'active',
              location: 'San Francisco, CA',
              tags: ['React', 'TypeScript'],
            },
            {
              id: 'job-2',
              title: 'Backend Developer',
              status: 'active',
              location: 'New York, NY',
              tags: ['Node.js', 'Python'],
            },
            {
              id: 'job-3',
              title: 'Full Stack Developer',
              status: 'archived',
              location: 'Remote',
              tags: ['React', 'Node.js'],
            },
          ],
        };
      }
    },
  });

  const { data: candidates, isLoading: candidatesLoading, error: candidatesError } = useQuery({
    queryKey: ['candidates'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/candidates?pageSize=1000');
        if (!res.ok) {
          throw new Error('Failed to fetch candidates');
        }
        return res.json();
      } catch (error) {
        console.error('Candidates API error:', error);
        // Return fallback data
        return {
          data: [
            {
              id: 'candidate-1',
              name: 'John Doe',
              email: 'john@example.com',
              stage: 'screen',
            },
            {
              id: 'candidate-2',
              name: 'Jane Smith',
              email: 'jane@example.com',
              stage: 'tech',
            },
            {
              id: 'candidate-3',
              name: 'Mike Johnson',
              email: 'mike@example.com',
              stage: 'offer',
            },
            {
              id: 'candidate-4',
              name: 'Sarah Wilson',
              email: 'sarah@example.com',
              stage: 'hired',
            },
            {
              id: 'candidate-5',
              name: 'David Brown',
              email: 'david@example.com',
              stage: 'screen',
            },
          ],
        };
      }
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
      value:
        candidates?.data?.filter((c: any) =>
          ['screen', 'tech', 'offer'].includes(c.stage)
        ).length || 0,
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

  const totalCandidates = candidates?.data?.length || 0;
  const hiredCandidates =
    candidates?.data?.filter((c: any) => c.stage === 'hired').length || 0;
  const conversionRate =
    totalCandidates > 0
      ? Math.round((hiredCandidates / totalCandidates) * 100)
      : 0;

  const recentCandidates = candidates?.data?.slice(0, 5) || [];
  const recentJobs = jobs?.data?.slice(0, 3) || [];

  // Show loading state
  if (jobsLoading || candidatesLoading) {
    return (
      <Layout>
        <PageContainer className="min-h-screen animate-fade-in">
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground text-lg">
              Loading your hiring intelligence hub...
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </PageContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageContainer className="min-h-screen bg-sky-100">

        {/* Header Section */}
        <div className="relative mb-12 text-center">
          <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent dark:from-primary/10 pointer-events-none" />
<h1 className="relative text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-3 sm:mb-4 bg-gradient-to-r from-sky-300 via-sky-400 to-sky-500 bg-clip-text text-transparent animate-fade-in">
  Dashboard
</h1>



          <p className="relative text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto animate-fade-in-up">
            Your all-in-one hiring intelligence hub
          </p>
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-primary/50 via-accent/50 to-secondary/50 rounded-full blur-sm" />
        </div>

        {/* Stats Section */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8 sm:mb-10">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                className="group relative overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div
                    className={cn(
                      'h-10 w-10 rounded-full flex items-center justify-center',
                      stat.bgColor,
                      'group-hover:scale-110 transition-transform'
                    )}
                  >
                    <Icon className={cn('h-5 w-5', stat.color)} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl sm:text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant={
                        stat.changeType === 'positive' ? 'default' : 'destructive'
                      }
                      className="text-xs"
                    >
                      {stat.change}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      vs last month
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions & Performance */}
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-3 mb-8 sm:mb-10">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-none overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10 pointer-events-none" />
              <CardHeader className="relative">
                <CardTitle className="text-2xl font-semibold">
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Manage and track your hiring workflow
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 grid-cols-1 sm:grid-cols-2 relative">
                {quickActions.map((action) => (
                  <Link
                    key={action.title}
                    to={action.link}
                    className="group flex items-center gap-4 rounded-xl p-5 transition-all hover:shadow-md hover:-translate-y-1 hover:bg-primary/5"
                  >
                    <div
                      className={cn(
                        'flex h-14 w-14 items-center justify-center rounded-xl',
                        action.bg
                      )}
                    >
                      <action.icon
                        className={cn('h-7 w-7', action.color)}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-base">{action.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {action.desc}
                      </p>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-4 sm:space-y-6">
            {/* Conversion Rate */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Conversion Rate
                </CardTitle>
                <CardDescription>Hiring success overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xl sm:text-2xl font-bold text-primary">
                      {conversionRate}%
                    </span>
                    <Target className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                  </div>
                  <Progress value={conversionRate} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {hiredCandidates} of {totalCandidates} candidates hired
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest candidate updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentCandidates.slice(0, 3).map((candidate: any) => (
                    <div
                      key={candidate.id}
                      className="flex items-center gap-3 hover:bg-muted/30 p-2 rounded-lg transition-all"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {candidate.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {candidate.stage}
                        </p>
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
        <Card className="shadow-lg border-none">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Recent Job Postings
            </CardTitle>
            <CardDescription>Your latest active openings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {recentJobs.map((job: any) => (
                <Link key={job.id} to={`/jobs/${job.id}`}>
                  <Card className="hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer border rounded-xl">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <h3 className="font-semibold text-base flex-1 min-w-0">{job.title}</h3>
                        <Badge
                          variant={
                            job.status === 'active' ? 'default' : 'secondary'
                          }
                          className="shrink-0"
                        >
                          {job.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {job.location}
                      </p>
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
      </PageContainer>
    </Layout>
  );
}

const quickActions = [
  {
    title: 'Manage Jobs',
    desc: 'Create and edit job openings',
    icon: Briefcase,
    link: '/jobs',
    bg: 'bg-primary/10',
    color: 'text-primary',
  },
  {
    title: 'View Candidates',
    desc: 'Track applicant progress',
    icon: Users,
    link: '/candidates',
    bg: 'bg-accent/10',
    color: 'text-accent',
  },
  {
    title: 'Assessments',
    desc: 'Create and assign tests',
    icon: ClipboardCheck,
    link: '/assessments',
    bg: 'bg-warning/10',
    color: 'text-warning',
  },
  {
    title: 'Analytics',
    desc: 'View hiring insights',
    icon: Award,
    link: '/analytics',
    bg: 'bg-primary/10',
    color: 'text-primary',
  },
];
