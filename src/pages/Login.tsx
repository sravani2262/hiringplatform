import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2,
  Shield,
  Zap,
  Users,
  CheckCircle,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const demoCredentials = [
    { email: 'demo@talentflow.com', password: 'demo', role: 'Administrator' },
    { email: 'sarah@company.com', password: 'password123', role: 'HR Manager' },
    { email: 'mike@company.com', password: 'password123', role: 'Recruiter' }
  ];

  const fillDemoCredentials = (demo: typeof demoCredentials[0]) => {
    setEmail(demo.email);
    setPassword(demo.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-mesh opacity-20" />
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-accent/10 to-transparent rounded-full blur-3xl" />

      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex flex-1 p-12 items-center justify-center relative">
        <div className="max-w-lg w-full space-y-8 animate-fade-in-up">
          {/* Brand */}
          <div className="text-center">
            <BrandLogo size="xl" variant="gradient" animated={true} className="justify-center mb-8" />
            <h1 className="text-4xl font-black text-slate-900 mb-4">
              Welcome Back to
              <span className="block text-gradient-primary">TalentFlow</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Your AI-powered hiring platform that transforms recruitment into an intelligent, streamlined process.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            {[
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Streamlined workflows reduce hiring time by 60%',
                color: 'text-yellow-600 bg-yellow-100'
              },
              {
                icon: Shield,
                title: 'Enterprise Security',
                description: 'Bank-level encryption keeps your data safe',
                color: 'text-green-600 bg-green-100'
              },
              {
                icon: Users,
                title: 'Team Collaboration',
                description: 'Built-in tools for seamless team coordination',
                color: 'text-blue-600 bg-blue-100'
              }
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className="flex items-center gap-4 animate-fade-in-left"
                style={{ animationDelay: `${index * 200 + 600}ms` }}
              >
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shadow-lg', feature.color)}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{feature.title}</h3>
                  <p className="text-sm text-slate-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Social Proof */}
          <div className="text-center space-y-4 animate-fade-in-up" style={{ animationDelay: '1s' }}>
            <div className="flex justify-center items-center gap-1">
              {[1,2,3,4,5].map((i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <p className="text-slate-600">
              <span className="font-semibold">4.9/5</span> from 500+ companies
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 lg:max-w-md xl:max-w-lg p-8 flex items-center justify-center">
        <div className="w-full max-w-sm space-y-6">
          {/* Mobile Brand */}
          <div className="lg:hidden text-center mb-8 animate-fade-in-down">
            <BrandLogo size="lg" variant="gradient" animated={true} className="justify-center mb-4" />
            <h1 className="text-2xl font-black text-slate-900">Welcome Back</h1>
          </div>

          {/* Login Card */}
          <Card className="card-premium border-none shadow-2xl rounded-3xl animate-scale-in">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/50 to-white" />
            
            <CardHeader className="relative z-10 text-center pb-6">
              <CardTitle className="text-2xl font-bold text-slate-800">Sign In</CardTitle>
              <CardDescription className="text-slate-600">
                Access your recruitment dashboard
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10 space-y-6">
              {/* Demo Credentials */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-slate-700">Quick Demo Access:</Label>
                <div className="grid gap-2">
                  {demoCredentials.map((demo, index) => (
                    <Button
                      key={demo.email}
                      variant="outline"
                      size="sm"
                      onClick={() => fillDemoCredentials(demo)}
                      className="justify-start text-left p-3 h-auto border-slate-200 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary">
                            {demo.email.split('@')[0].substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-slate-700 text-sm group-hover:text-primary">
                            {demo.role}
                          </div>
                          <div className="text-xs text-slate-500">{demo.email}</div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert className="border-red-200 bg-red-50 animate-fade-in">
                    <AlertDescription className="text-red-700">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="pl-10 h-12 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 h-12 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center space-y-4">
                <p className="text-sm text-slate-600">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-primary hover:text-primary/80 font-semibold hover:underline transition-colors">
                    Sign up for free
                  </Link>
                </p>
                
                <p className="text-xs text-slate-500">
                  By signing in, you agree to our{' '}
                  <a href="#" className="text-primary hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}