// 4. Updated Home component with Supabase integration
// pages/index.js or app/page.js
'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import ProfilePictureUpload from '@/components/ProfilePictureUpload';

export function AuthWatcher() {
  const supabase = createClientComponentClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      }
    );

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, []);

  return (
    <div>
      <p>{isLoggedIn ? 'Logged in' : 'Not logged in'}</p>
    </div>
  );
}

// Types for better TypeScript support
interface LoginForm {
  email: string;
  password: string;
}

interface SignupForm {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  organization: string;
  domains: string[];
  linkedinUrl: string;
  portfolioUrl: string;
  bio: string;
  profilePhoto: File | null;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
  organization: string;
  domain_of_interest: string[];
  linkedin: string | null;
  github: string | null;
  bio: string | null;
  profile_pic: string | null;
}

interface LoginResponse {
  user: any;
  profile: UserProfile;
}

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Moon, Sun, Users, Shield, TrendingUp, Zap, ArrowRight, Github, Linkedin, Upload, X, AlertCircle, Loader2 } from 'lucide-react';
import Dashboard from '@/components/Dashboard';
import { createUser, loginUser } from '@/lib/userService';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [loginForm, setLoginForm] = useState<LoginForm>({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState<SignupForm>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    organization: '',
    domains: [],
    linkedinUrl: '',
    portfolioUrl: '',
    bio: '',
    profilePhoto: null
  });
  const [signupErrors, setSignupErrors] = useState<Record<string, string | undefined>>({});
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const availableDomains = [
    'Artificial Intelligence', 'Machine Learning', 'Blockchain', 'IoT', 'Cybersecurity',
    'Biotechnology', 'Healthcare', 'FinTech', 'EdTech', 'AgriTech', 'CleanTech',
    'Robotics', 'Data Science', 'Cloud Computing', 'Mobile Development', 'Web Development',
    'DevOps', 'UI/UX Design', 'Product Management', 'Digital Marketing', 'E-commerce',
    'Gaming', 'AR/VR', 'Quantum Computing', 'Nanotechnology', 'Renewable Energy'
  ];

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsLoggedIn(true);
        // Fetch user profile
        try {
          const { data: profileData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

          if (!error && profileData) {
            setCurrentUser(profileData);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          setIsLoggedIn(true);
          // Fetch user profile
          try {
            const { data: profileData, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (!error && profileData) {
              setCurrentUser(profileData);
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        } else {
          setIsLoggedIn(false);
          setCurrentUser(null);
        }
      }
    );

    // Check theme preference - only access localStorage on client side
    if (typeof window !== 'undefined') {
      const theme = localStorage.getItem('startlink_theme');
      if (theme === 'dark') {
        setDarkMode(true);
        document.documentElement.classList.add('dark');
      }
    }

    return () => subscription.unsubscribe();
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (typeof window !== 'undefined') {
      if (!darkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('startlink_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('startlink_theme', 'light');
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const result: LoginResponse = await loginUser(loginForm.email, loginForm.password);
      setIsLoggedIn(true);
      setCurrentUser(result.profile);
      setLoginForm({ email: '', password: '' });
    } catch (error) {
      console.error('Login error:', error);
      // Handle login error - show error message to user
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      alert('Login failed: ' + errorMessage);
    } finally {
      setLoginLoading(false);
    }
  };

  const validateSignupForm = () => {
    const errors: Record<string, string> = {};

    // Full Name validation
    if (!signupForm.fullName?.trim()) {
      errors.fullName = 'Full name is required';
    } else if (signupForm.fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!signupForm.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(signupForm.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!signupForm.password) {
      errors.password = 'Password is required';
    } else if (signupForm.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }

    // Confirm Password validation
    if (!signupForm.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (signupForm.password !== signupForm.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    // Role validation
    if (!signupForm.role) {
      errors.role = 'Please select your role';
    }

    // Organization validation
    if (!signupForm.organization?.trim()) {
      errors.organization = 'Organization/Institute name is required';
    }

    // LinkedIn URL validation
    if (signupForm.linkedinUrl && !signupForm.linkedinUrl.includes('linkedin.com')) {
      errors.linkedinUrl = 'Please enter a valid LinkedIn URL';
    }

    // Portfolio URL validation
    const urlRegex = /^https?:\/\/.+/;
    if (signupForm.portfolioUrl && !urlRegex.test(signupForm.portfolioUrl)) {
      errors.portfolioUrl = 'Please enter a valid URL (starting with http:// or https://)';
    }

    // Bio validation
    if (signupForm.bio && signupForm.bio.length > 200) {
      errors.bio = 'Bio must be 200 characters or less';
    }

    // Domains validation
    if (selectedDomains.length === 0) {
      errors.domains = 'Please select at least one domain of interest';
    }

    return errors;
  };

  // Missing handleDomainToggle function
  const handleDomainToggle = (domain: string) => {
    setSelectedDomains(prev => {
      if (prev.includes(domain)) {
        return prev.filter(d => d !== domain);
      } else {
        return [...prev, domain];
      }
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateSignupForm();
    setSignupErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);

      try {
        const userData = {
          ...signupForm,
          domains: selectedDomains
        };

        const result = await createUser(userData);

        // Reset form
        setSignupForm({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: '',
          organization: '',
          domains: [],
          linkedinUrl: '',
          portfolioUrl: '',
          bio: '',
          profilePhoto: null
        });
        setSelectedDomains([]);
        setSignupErrors({});

        // Show success message
        alert('Account created successfully! Please check your email for verification.');

      } catch (error: unknown) {
        console.error('Signup error:', error);

        // Handle specific error cases
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

        if (errorMessage.includes('User already registered')) {
          setSignupErrors(prev => ({
            ...prev,
            email: 'An account with this email already exists'
          }));
        } else if (errorMessage.includes('Password')) {
          setSignupErrors(prev => ({
            ...prev,
            password: errorMessage
          }));
        } else if (errorMessage.includes('profile picture')) {
          setSignupErrors(prev => ({
            ...prev,
            profilePhoto: 'Failed to upload profile picture. Please try again.'
          }));
        } else {
          // Generic error
          alert('Signup failed: ' + errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setSignupErrors(prev => ({
          ...prev,
          profilePhoto: 'Please upload a JPG, JPEG, PNG, GIF, or WebP file'
        }));
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setSignupErrors(prev => ({
          ...prev,
          profilePhoto: 'File size must be less than 5MB'
        }));
        return;
      }

      setSignupForm(prev => ({ ...prev, profilePhoto: file }));
      setSignupErrors(prev => ({ ...prev, profilePhoto: undefined }));
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoggedIn) {
    return <Dashboard onLogout={handleLogout} user={currentUser} />;
  }

  // Return the actual login/signup JSX here
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">StartLink</span>
        </div>
        <Button variant="ghost" size="sm" onClick={toggleTheme}>
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Accelerating Innovation Through{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Collaboration
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            StartLink is the premier platform connecting innovators, researchers, and startup founders.
            Streamline your research management, protect your intellectual property, and accelerate
            your journey from idea to impact through seamless collaboration.
          </p>

          {/* Login/Signup Buttons */}
          <div className="flex justify-center space-x-4 mb-16">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="px-8 py-3 text-lg">
                  Login <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Sign In to StartLink</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loginLoading}>
                    {loginLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Sign In
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="lg" className="px-8">
                  Sign Up
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Join StartLink</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSignup} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={signupForm.fullName}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter your full name"
                      className={signupErrors.fullName ? 'border-red-500' : ''}
                    />
                    {signupErrors.fullName && (
                      <p className="text-red-500 text-sm mt-1">{signupErrors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="signupEmail">Email *</Label>
                    <Input
                      id="signupEmail"
                      type="email"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                      className={signupErrors.email ? 'border-red-500' : ''}
                    />
                    {signupErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{signupErrors.email}</p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <Label htmlFor="signupPassword">Password *</Label>
                    <Input
                      id="signupPassword"
                      type="password"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                      className={signupErrors.password ? 'border-red-500' : ''}
                    />
                    {signupErrors.password && (
                      <p className="text-red-500 text-sm mt-1">{signupErrors.password}</p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className={signupErrors.confirmPassword ? 'border-red-500' : ''}
                    />
                    {signupErrors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{signupErrors.confirmPassword}</p>
                    )}
                  </div>

                  {/* Role */}
                  <div>
                    <Label htmlFor="role">Role *</Label>
                    <Select
                      value={signupForm.role}
                      onValueChange={(value) => setSignupForm(prev => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger className={signupErrors.role ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="founder">Founder</SelectItem>
                        <SelectItem value="co-founder">Co-founder</SelectItem>
                        <SelectItem value="investor">Investor</SelectItem>
                        <SelectItem value="mentor">Mentor</SelectItem>
                        <SelectItem value="developer">Developer</SelectItem>
                        <SelectItem value="designer">Designer</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {signupErrors.role && (
                      <p className="text-red-500 text-sm mt-1">{signupErrors.role}</p>
                    )}
                  </div>

                  {/* Organization */}
                  <div>
                    <Label htmlFor="organization">Organization/Institute *</Label>
                    <Input
                      id="organization"
                      value={signupForm.organization}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, organization: e.target.value }))}
                      className={signupErrors.organization ? 'border-red-500' : ''}
                    />
                    {signupErrors.organization && (
                      <p className="text-red-500 text-sm mt-1">{signupErrors.organization}</p>
                    )}
                  </div>

                  {/* Domains */}
                  <div>
                    <Label>Domains of Interest *</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto border rounded p-2">
                      {availableDomains.map((domain) => (
                        <div key={domain} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`domain-${domain}`}
                            checked={selectedDomains.includes(domain)}
                            onChange={() => handleDomainToggle(domain)}
                            className="rounded"
                          />
                          <label htmlFor={`domain-${domain}`} className="text-sm">
                            {domain}
                          </label>
                        </div>
                      ))}
                    </div>
                    {signupErrors.domains && (
                      <p className="text-red-500 text-sm mt-1">{signupErrors.domains}</p>
                    )}
                  </div>

                  {/* LinkedIn URL */}
                  <div>
                    <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                    <Input
                      id="linkedinUrl"
                      value={signupForm.linkedinUrl}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className={signupErrors.linkedinUrl ? 'border-red-500' : ''}
                    />
                    {signupErrors.linkedinUrl && (
                      <p className="text-red-500 text-sm mt-1">{signupErrors.linkedinUrl}</p>
                    )}
                  </div>

                  {/* Portfolio URL */}
                  <div>
                    <Label htmlFor="portfolioUrl">Portfolio URL</Label>
                    <Input
                      id="portfolioUrl"
                      value={signupForm.portfolioUrl}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, portfolioUrl: e.target.value }))}
                      placeholder="https://yourportfolio.com"
                      className={signupErrors.portfolioUrl ? 'border-red-500' : ''}
                    />
                    {signupErrors.portfolioUrl && (
                      <p className="text-red-500 text-sm mt-1">{signupErrors.portfolioUrl}</p>
                    )}
                  </div>

                  {/* Bio */}
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={signupForm.bio}
                      onChange={(e) => setSignupForm(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself..."
                      className={signupErrors.bio ? 'border-red-500' : ''}
                      maxLength={200}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {signupForm.bio.length}/200 characters
                    </p>
                    {signupErrors.bio && (
                      <p className="text-red-500 text-sm mt-1">{signupErrors.bio}</p>
                    )}
                  </div>

                  {/* Profile Photo */}
                  <ProfilePictureUpload
                    currentImage={signupForm.profilePhoto ? URL.createObjectURL(signupForm.profilePhoto) : null}
                    onImageSelect={(file: File | null, error?: string) => {
                      if (error) {
                        setSignupErrors(prev => ({ ...prev, profilePhoto: error }));
                        setSignupForm(prev => ({ ...prev, profilePhoto: null }));
                      } else {
                        setSignupForm(prev => ({ ...prev, profilePhoto: file }));
                        setSignupErrors(prev => ({ ...prev, profilePhoto: undefined }));
                      }
                    }}
                    onImageRemove={() => {
                      setSignupForm(prev => ({ ...prev, profilePhoto: null }));
                      setSignupErrors(prev => ({ ...prev, profilePhoto: undefined }));
                    }}
                    error={signupErrors.profilePhoto}
                    isLoading={isLoading}
                    size="lg"
                  />

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Create Account
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Collaborative Network</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Connect with researchers, innovators, and startup founders across the globe
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">IPR Management</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Streamline intellectual property filing and track your innovations
              </p>
            </CardContent>
          </Card>

          <Card className="text-center p-6 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Growth Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor progress and make data-driven decisions for your startup journey
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Transform Your Innovation Journey?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Join thousands of innovators already using StartLink to accelerate their success
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline" size="sm">
              <Github className="w-4 h-4 mr-2" /> Open Source
            </Button>
            <Button variant="outline" size="sm">
              <Linkedin className="w-4 h-4 mr-2" /> Professional Network
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">StartLink</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              © 2025 StartLink. Accelerating innovation through collaboration.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}