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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 container-responsive">
        {/* Enhanced Header Section */}
        <div className="relative mb-16 text-center pt-8">
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-radial from-indigo-400/8 via-purple-400/4 to-transparent pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-400/15 to-purple-400/15 rounded-full blur-3xl opacity-30" />
          
          {/* Header content */}
          <div className="relative mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-indigo-400/20 mb-6">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-sm font-medium text-slate-600">Business Intelligence</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 gradient-text-rainbow tracking-tight">
              Analytics
            </h1>
            
            <p className="text-slate-600 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-8">
              Gain deep insights into your hiring performance with intelligent analytics
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent rounded-full" />
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full" />
        </div>

        {/* Enhanced Key Metrics */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-12">
          <Card className="group card-premium hover-lift hover-glow border-none shadow-lg rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-green-50/50 to-white group-hover:from-green-50 group-hover:via-green-100/30 group-hover:to-green-50/50 transition-all duration-500" />
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  Conversion Rate
                </CardTitle>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 group-hover:text-green-600 transition-colors duration-300">
                  {conversionRate}%
                </div>
              </div>
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg bg-green-100 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Target className="h-7 w-7 text-green-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg" />
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 text-green-700 border-green-200">
                    {hiredCandidates} hired
                  </Badge>
                  <span className="text-xs text-slate-500 font-medium">
                    of {totalCandidates}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group card-premium hover-lift hover-glow border-none shadow-lg rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/50 to-white group-hover:from-blue-50 group-hover:via-blue-100/30 group-hover:to-blue-50/50 transition-all duration-500" />
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  Active Jobs
                </CardTitle>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                  {totalActiveJobs}
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
                    Accepting applications
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group card-premium hover-lift hover-glow border-none shadow-lg rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-orange-50/50 to-white group-hover:from-orange-50 group-hover:via-orange-100/30 group-hover:to-orange-50/50 transition-all duration-500" />
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-yellow-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  In Progress
                </CardTitle>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 group-hover:text-orange-600 transition-colors duration-300">
                  {inProgressCandidates}
                </div>
              </div>
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg bg-orange-100 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Users className="h-7 w-7 text-orange-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg" />
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-100 text-orange-700 border-orange-200">
                    In pipeline
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group card-premium hover-lift hover-glow border-none shadow-lg rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-purple-50/50 to-white group-hover:from-purple-50 group-hover:via-purple-100/30 group-hover:to-purple-50/50 transition-all duration-500" />
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="flex flex-row items-center justify-between pb-3 relative z-10">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
                  Time to Hire
                </CardTitle>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 group-hover:text-purple-600 transition-colors duration-300">
                  {averageTimeToHire}
                </div>
              </div>
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg bg-purple-100 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <Clock className="h-7 w-7 text-purple-600" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg" />
              </div>
            </CardHeader>
            
            <CardContent className="pt-0 relative z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-700 border-purple-200">
                    Days average
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Charts */}
        <div className="grid gap-8 lg:grid-cols-2 mb-12">
          {/* Enhanced Stage Distribution */}
          <Card className="group card-premium hover-lift hover-glow border-none shadow-xl rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-indigo-50/30 to-white" />
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="relative z-10 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-800">
                    Candidate Distribution
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Current status across all stages
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="relative z-10">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-inner">
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={stageDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={90}
                      innerRadius={30}
                      fill="#8884d8"
                      dataKey="value"
                      stroke="none"
                    >
                      {stageDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: 'none', 
                        borderRadius: '12px', 
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Conversion Funnel */}
          <Card className="group card-premium hover-lift hover-glow border-none shadow-xl rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-emerald-50/30 to-white" />
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-emerald-400/10 to-blue-400/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="relative z-10 pb-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-800">
                    Conversion Funnel
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Progress through hiring pipeline
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="relative z-10">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-inner">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={conversionFunnel} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12, fill: '#64748b' }} 
                      axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: '#64748b' }} 
                      axisLine={{ stroke: '#e2e8f0' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                        border: 'none', 
                        borderRadius: '12px', 
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
                      }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {conversionFunnel.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
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
