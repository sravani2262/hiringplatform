import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { 
  Sparkles, 
  Zap, 
  Users, 
  TrendingUp, 
  Shield, 
  Clock, 
  Target, 
  Brain,
  ArrowRight,
  Star,
  CheckCircle,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

export function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/30 min-h-screen">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-mesh opacity-20" />
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl" />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 animate-fade-in-down">
          <BrandLogo size="lg" variant="gradient" animated={true} />
          
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/jobs" className="text-slate-600 hover:text-primary transition-colors font-medium">
              Jobs
            </Link>
            <Link to="/candidates" className="text-slate-600 hover:text-primary transition-colors font-medium">
              Candidates
            </Link>
            <Link to="/analytics" className="text-slate-600 hover:text-primary transition-colors font-medium">
              Analytics
            </Link>
            <Button asChild className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300">
              <Link to="/dashboard">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </nav>
        </header>

        {/* Hero Content */}
        <div className="grid lg:grid-cols-2 gap-8 items-center mb-20">
          {/* Left Side - Content */}
          <div className="space-y-8 animate-fade-in-up">
            {/* Announcement Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full border border-primary/20 animate-bounce-gentle">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                New: AI-Powered Candidate Matching
              </span>
              <Badge className="bg-primary text-white text-xs px-2 py-0.5">
                Beta
              </Badge>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight">
                Transform Your
                <span className="block text-gradient-primary">
                  Hiring Process
                </span>
                <span className="block">
                  with AI Power
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 leading-relaxed max-w-lg">
                Streamline recruitment, discover top talent, and make data-driven hiring decisions with our intelligent platform.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <Link to="/dashboard" className="flex items-center">
                  Start Free Trial
                  <Zap className="w-5 h-5 ml-2 group-hover:animate-bounce" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-4 rounded-xl border-2 border-slate-300 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
              >
                <Play className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                Watch Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 pt-8">
              <div className="flex -space-x-3">
                {[1,2,3,4,5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-white flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">
                      {String.fromCharCode(64 + i)}
                    </span>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 mt-1">
                  Trusted by <span className="font-semibold">500+ companies</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Visual */}
          <div className="relative animate-fade-in-right">
            <div className="relative">
              {/* Main Dashboard Preview */}
              <Card className="card-premium shadow-2xl rounded-3xl overflow-hidden backdrop-blur-sm border-none">
                <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50/80" />
                <CardContent className="p-8 relative z-10">
                  {/* Mock Dashboard Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800">AI Dashboard</h3>
                        <p className="text-xs text-slate-500">Real-time insights</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-slate-500">Live</span>
                    </div>
                  </div>

                  {/* Mock Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      { label: 'Active Jobs', value: '24', icon: Target, color: 'text-primary bg-primary/10' },
                      { label: 'Candidates', value: '1.2k', icon: Users, color: 'text-accent bg-accent/10' },
                      { label: 'Interviews', value: '48', icon: Clock, color: 'text-yellow-600 bg-yellow-100' },
                      { label: 'Hired', value: '12', icon: CheckCircle, color: 'text-green-600 bg-green-100' }
                    ].map((stat) => (
                      <div key={stat.label} className="p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200/50">
                        <div className="flex items-center gap-2 mb-1">
                          <div className={cn('w-6 h-6 rounded-lg flex items-center justify-center', stat.color)}>
                            <stat.icon className="w-3 h-3" />
                          </div>
                          <span className="text-xs font-medium text-slate-600">{stat.label}</span>
                        </div>
                        <div className="text-lg font-bold text-slate-800">{stat.value}</div>
                      </div>
                    ))}
                  </div>


                  {/* Mock List */}
                  <div className="space-y-2">
                    {['Sarah Johnson - Frontend Dev', 'Mike Chen - Backend Dev'].map((name) => (
                      <div key={name} className="flex items-center gap-3 p-2 rounded-lg bg-white/60 backdrop-blur-sm">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/30 to-accent/30" />
                        <span className="text-sm font-medium text-slate-700 flex-1">{name}</span>
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="card-premium hover-lift border-none shadow-lg rounded-2xl overflow-hidden group animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/50 to-white group-hover:from-primary/5 group-hover:to-accent/5 transition-all duration-500" />
              
              <CardContent className="p-8 relative z-10">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    'w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300',
                    feature.color,
                    'group-hover:scale-110 group-hover:rotate-6'
                  )}>
                    <feature.icon className="w-7 h-7" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-8 animate-fade-in-up">
          <div className="space-y-4">
           
          </div>
          
          
        </div>
      </div>
    </div>
  );
}

const features = [
  {
    title: 'AI-Powered Matching',
    description: 'Advanced algorithms analyze resumes and match candidates to job requirements with precision.',
    icon: Brain,
    color: 'bg-purple-100 text-purple-600'
  },
  {
    title: 'Smart Analytics',
    description: 'Real-time insights and data-driven recommendations to optimize your hiring process.',
    icon: TrendingUp,
    color: 'bg-blue-100 text-blue-600'
  },
  {
    title: 'Streamlined Workflow',
    description: 'Automated processes and intuitive interface reduce time-to-hire significantly.',
    icon: Zap,
    color: 'bg-yellow-100 text-yellow-600'
  },
  {
    title: 'Collaborative Hiring',
    description: 'Built-in tools for team collaboration and feedback collection throughout the process.',
    icon: Users,
    color: 'bg-green-100 text-green-600'
  },
  {
    title: 'Secure Platform',
    description: 'Enterprise-grade security ensures your data and candidate information stays protected.',
    icon: Shield,
    color: 'bg-red-100 text-red-600'
  },
  {
    title: 'Quick Setup',
    description: 'Get started in minutes with our intuitive onboarding and setup process.',
    icon: Clock,
    color: 'bg-cyan-100 text-cyan-600'
  }
];