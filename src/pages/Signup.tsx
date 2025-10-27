import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { BrandLogo } from '@/components/branding/BrandLogo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Building,
  ArrowRight, 
  Loader2,
  CheckCircle,
  Sparkles,
  Zap,
  Shield,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { signup, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Calculate password strength
    if (name === 'password') {
      let strength = 0;
      if (value.length >= 8) strength += 25;
      if (/[A-Z]/.test(value)) strength += 25;
      if (/[a-z]/.test(value)) strength += 25;
      if (/[0-9]/.test(value)) strength += 25;
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    const result = await signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      company: formData.company
    });
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Signup failed');
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return 'bg-red-500';
    if (passwordStrength < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return 'Weak';
    if (passwordStrength < 50) return 'Fair';
    if (passwordStrength < 75) return 'Good';
    return 'Strong';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-mesh opacity-20" />
      <div className="absolute inset-0 bg-dots opacity-30" />
      <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-accent/10 to-transparent rounded-full blur-3xl" />

      {/* Left Side - Signup Form */}
      <div className="flex-1 lg:max-w-lg p-8 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Brand */}
          <div className="lg:hidden text-center mb-8 animate-fade-in-down">
            <BrandLogo size="lg" variant="gradient" animated={true} className="justify-center mb-4" />
            <h1 className="text-2xl font-black text-slate-900">Join TalentFlow</h1>
          </div>

          {/* Signup Card */}
          <Card className="card-premium border-none shadow-2xl rounded-3xl animate-scale-in">
            <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/50 to-white" />
            
            <CardHeader className="relative z-10 text-center pb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary animate-bounce" />
                <Badge className="bg-gradient-to-r from-primary to-accent text-white text-xs px-3 py-1">
                  Free Trial
                </Badge>
                <Sparkles className="w-5 h-5 text-accent animate-bounce" style={{animationDelay: '0.5s'}} />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800">Create Account</CardTitle>
              <CardDescription className="text-slate-600">
                Start your 14-day free trial today
              </CardDescription>
            </CardHeader>

            <CardContent className="relative z-10 space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert className="border-red-200 bg-red-50 animate-fade-in">
                    <AlertDescription className="text-red-700">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-slate-700">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        className="pl-10 h-12 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-semibold text-slate-700">
                      Company
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                      <Input
                        id="company"
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Acme Inc."
                        className="pl-10 h-12 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-slate-700">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@company.com"
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
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a strong password"
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
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-600">Password Strength</span>
                        <span className={cn(
                          "text-xs font-semibold",
                          passwordStrength < 50 ? "text-red-600" :
                          passwordStrength < 75 ? "text-yellow-600" : "text-green-600"
                        )}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className={cn(
                            "h-2 rounded-full transition-all duration-300",
                            getPasswordStrengthColor()
                          )}
                          style={{ width: `${passwordStrength}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-700">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10 h-12 border-slate-200 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-slate-100"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-slate-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-slate-400" />
                      )}
                    </Button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-600 mt-1">Passwords do not match</p>
                  )}
                  {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password && (
                    <div className="flex items-center gap-1 mt-1">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                      <p className="text-xs text-green-600">Passwords match</p>
                    </div>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Start Free Trial
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="text-center space-y-4">
                <p className="text-sm text-slate-600">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary hover:text-primary/80 font-semibold hover:underline transition-colors">
                    Sign in here
                  </Link>
                </p>
                
                <p className="text-xs text-slate-500">
                  By creating an account, you agree to our{' '}
                  <a href="#" className="text-primary hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex flex-1 p-12 items-center justify-center relative">
        <div className="max-w-lg w-full space-y-8 animate-fade-in-up">
          {/* Brand */}
          <div className="text-center">
            <BrandLogo size="xl" variant="gradient" animated={true} className="justify-center mb-8" />
            <h1 className="text-4xl font-black text-slate-900 mb-4">
              Start Your
              <span className="block text-gradient-primary">Free Trial Today</span>
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              Join thousands of companies transforming their hiring process with AI-powered recruitment.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-6">
            {[
              {
                icon: Zap,
                title: '14-Day Free Trial',
                description: 'Full access to all premium features, no credit card required',
                color: 'text-yellow-600 bg-yellow-100'
              },
              {
                icon: Users,
                title: 'Unlimited Team Members',
                description: 'Collaborate with your entire hiring team from day one',
                color: 'text-blue-600 bg-blue-100'
              },
              {
                icon: Shield,
                title: 'Enterprise Security',
                description: 'SOC 2 compliant with advanced data protection',
                color: 'text-green-600 bg-green-100'
              }
            ].map((benefit, index) => (
              <div 
                key={benefit.title}
                className="flex items-center gap-4 animate-fade-in-right"
                style={{ animationDelay: `${index * 200 + 600}ms` }}
              >
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shadow-lg', benefit.color)}>
                  <benefit.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{benefit.title}</h3>
                  <p className="text-sm text-slate-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6 border border-primary/20 animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
            <h3 className="font-bold text-slate-800 mb-2">Ready to get started?</h3>
            <p className="text-sm text-slate-600 mb-4">
              No setup fees, no hidden costs. Cancel anytime during your trial.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-slate-600">Setup in under 5 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}