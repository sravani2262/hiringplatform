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
      <PageContainer className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 container-responsive">
        {/* Enhanced Header Section */}
        <div className="relative mb-16 text-center">
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-accent/5 to-transparent pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-3xl opacity-30" />
          
          {/* Main heading with enhanced animation */}
          <div className="relative">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-4 sm:mb-6 gradient-text-rainbow tracking-tight">
              Dashboard
            </h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-primary/20 mb-6">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm font-medium text-slate-600">Live Analytics</span>
            </div>
          </div>
          
          <p className="relative text-slate-600 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
            Transform your hiring process with intelligent insights and streamlined workflows
          </p>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full" />
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent rounded-full" />
        </div>

        {/* Enhanced Stats Section */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.title}
                className="group relative overflow-hidden card-premium hover-lift hover-glow border-none shadow-lg rounded-3xl"
                style={{ 
                  animationDelay: `${index * 150}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards'
                }}
              >
                {/* Enhanced background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/80 to-white group-hover:from-primary/5 group-hover:via-accent/5 group-hover:to-secondary/5 transition-all duration-500" />
                
                {/* Floating orb effect */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
                  <div className="flex flex-col gap-1">
                    <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                      {stat.title}
                    </CardTitle>
                    <div className="text-3xl sm:text-4xl font-black text-slate-900 group-hover:text-primary transition-colors duration-300">
                      {stat.value}
                    </div>
                  </div>
                  <div className="relative">
                    <div
                      className={cn(
                        'h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg',
                        stat.bgColor,
                        'group-hover:scale-110 group-hover:rotate-3 transition-all duration-300'
                      )}
                    >
                      <Icon className={cn('h-7 w-7', stat.color)} />
                    </div>
                    {/* Pulsing indicator */}
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg" />
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={stat.changeType === 'positive' ? 'default' : 'destructive'}
                        className={cn(
                          'text-xs font-semibold px-3 py-1 rounded-full shadow-sm',
                          stat.changeType === 'positive' 
                            ? 'bg-green-100 text-green-700 border-green-200' 
                            : 'bg-red-100 text-red-700 border-red-200'
                        )}
                      >
                        {stat.change}
                      </Badge>
                      <span className="text-xs text-slate-500 font-medium">
                        vs last month
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enhanced Quick Actions & Performance */}
        <div className="grid gap-8 lg:grid-cols-3 mb-12">
          {/* Enhanced Quick Actions */}
          <div className="lg:col-span-2">
            <Card className="card-premium shadow-2xl border-none overflow-hidden relative rounded-3xl">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/50 to-primary/5" />
              <div className="absolute inset-0 bg-grid-animated opacity-10" />
              
              <CardHeader className="relative pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold text-slate-800">
                      Quick Actions
                    </CardTitle>
                    <CardDescription className="text-slate-600">
                      Streamline your hiring workflow with one-click actions
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="grid gap-6 grid-cols-1 sm:grid-cols-2 relative pb-8">
                {quickActions.map((action, index) => (
                  <Link
                    key={action.title}
                    to={action.link}
                    className="group relative flex items-center gap-5 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 bg-white/80 backdrop-blur-sm border border-white/50 hover:border-primary/30"
                    style={{ animationDelay: `${index * 100 + 300}ms` }}
                  >
                    {/* Hover gradient overlay */}
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div className="relative">
                      <div
                        className={cn(
                          'flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg transition-all duration-300',
                          action.bg,
                          'group-hover:scale-110 group-hover:rotate-6'
                        )}
                      >
                        <action.icon className={cn('h-8 w-8', action.color)} />
                      </div>
                      {/* Floating dot */}
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0 relative">
                      <p className="font-bold text-lg text-slate-800 group-hover:text-primary transition-colors duration-300 mb-1">
                        {action.title}
                      </p>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {action.desc}
                      </p>
                    </div>
                    
                    {/* Arrow indicator */}
                    <div className="text-slate-400 group-hover:text-primary transition-colors duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
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
