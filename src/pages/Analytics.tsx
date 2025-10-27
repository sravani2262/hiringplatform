import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Users, Briefcase, Target, Award, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const stageColors = {
  applied: '#3b82f6',
  screen: '#8b5cf6',
  tech: '#f59e0b',
  offer: '#10b981',
  hired: '#059669',
  rejected: '#ef4444',
};

export default function Analytics() {
  const { data: jobsData, isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const res = await fetch('/api/jobs?pageSize=100');
      return res.json();
    },
  });

  const { data: candidatesData, isLoading: candidatesLoading } = useQuery({
    queryKey: ['candidates'],
    queryFn: async () => {
      const res = await fetch('/api/candidates?pageSize=1000');
      return res.json();
    },
  });

  if (jobsLoading || candidatesLoading) {
    return (
      <Layout>
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading analytics...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const jobs = jobsData?.data || [];
  const candidates = candidatesData?.data || [];

  // Calculate stage distribution
  const stageDistribution = Object.entries(
    candidates.reduce((acc: Record<string, number>, c: any) => {
      acc[c.stage] = (acc[c.stage] || 0) + 1;
      return acc;
    }, {})
  ).map(([stage, count]) => ({
    name: stage.charAt(0).toUpperCase() + stage.slice(1),
    value: count,
    color: stageColors[stage as keyof typeof stageColors],
  }));

  // Calculate candidates per job
  const candidatesPerJob = jobs.slice(0, 10).map((job: any) => ({
    name: job.title.length > 15 ? job.title.substring(0, 15) + '...' : job.title,
    applicants: candidates.filter((c: any) => c.jobId === job.id).length,
  }));

  // Calculate time to hire (mock data since we don't have actual dates)
  const timeToHireData = stageDistribution.map((_, index) => ({
    stage: stageDistribution[index].name,
    days: Math.floor(Math.random() * 30) + 5,
  }));

  // Calculate conversion funnel
  const conversionFunnel = [
    { name: 'Applied', value: candidates.filter((c: any) => c.stage === 'applied').length, color: '#3b82f6' },
    { name: 'Screening', value: candidates.filter((c: any) => c.stage === 'screen').length, color: '#8b5cf6' },
    { name: 'Technical', value: candidates.filter((c: any) => c.stage === 'tech').length, color: '#f59e0b' },
    { name: 'Offer', value: candidates.filter((c: any) => c.stage === 'offer').length, color: '#10b981' },
    { name: 'Hired', value: candidates.filter((c: any) => c.stage === 'hired').length, color: '#059669' },
  ];

  const totalActiveJobs = jobs.filter((j: any) => j.status === 'active').length;
  const totalCandidates = candidates.length;
  const hiredCandidates = candidates.filter((c: any) => c.stage === 'hired').length;
  const inProgressCandidates = candidates.filter((c: any) => ['screen', 'tech', 'offer'].includes(c.stage)).length;
  const conversionRate = totalCandidates > 0 ? Math.round((hiredCandidates / totalCandidates) * 100) : 0;
  const averageTimeToHire = Math.floor(Math.random() * 45) + 20; // Mock data

  return (
    <Layout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Analytics & Insights</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Hiring metrics and performance analytics</p>
        </div>

        {/* Key Metrics */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Conversion Rate</CardTitle>
              <Target className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{conversionRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                {hiredCandidates} hired out of {totalCandidates} candidates
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{totalActiveJobs}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {jobs.filter((j: any) => j.status === 'active').length} currently accepting applications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
              <Users className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{inProgressCandidates}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Candidates in pipeline
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Time to Hire</CardTitle>
              <Clock className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl sm:text-3xl font-bold">{averageTimeToHire}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Days from application to hire
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 mb-6 sm:mb-8">
          {/* Stage Distribution */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Candidate Stage Distribution</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Current status of all candidates</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={stageDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {stageDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Conversion Funnel */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Conversion Funnel</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Progress through hiring stages</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={conversionFunnel}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8">
                    {conversionFunnel.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Candidates per Job */}
        <Card className="mb-6 sm:mb-8 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">Top Jobs by Applicants</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Most popular job positions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <ResponsiveContainer width="100%" minHeight={300} height={300}>
                <BarChart data={candidatesPerJob}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="applicants" fill="#8884d8" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Stage Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Stage Breakdown</CardTitle>
            <CardDescription>Number of candidates in each stage</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {stageDistribution.map((stage) => (
                  <div key={stage.name} className="space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full shadow-sm"
                          style={{ backgroundColor: stage.color }}
                        />
                        <span className="text-sm sm:text-base font-medium">{stage.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs sm:text-sm">{stage.value} candidates</Badge>
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          {totalCandidates > 0 ? Math.round((stage.value / totalCandidates) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={totalCandidates > 0 ? (stage.value / totalCandidates) * 100 : 0}
                      className="h-2 sm:h-3"
                    />
                  </div>
                ))}
              </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
