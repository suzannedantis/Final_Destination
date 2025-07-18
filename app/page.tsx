// Multi-Step Signup Flow Component
'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import ProfilePictureUpload from '@/components/ProfilePictureUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Moon, Sun, Users, Shield, TrendingUp, Zap, ArrowRight, Github, Linkedin, Upload, X, AlertCircle, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import Dashboard from '@/components/Dashboard';
import { createUser, loginUser } from '@/lib/userService';
import { supabase } from '@/lib/supabase';
import { FcGoogle } from 'react-icons/fc'; // Google icon

const handleGoogleSignIn = async () => {
  const supabase = createClientComponentClient(); // Ensure client-side instance
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`, // dynamic for dev/prod
      },
    });

    if (error) throw error;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    alert('Google Sign-In failed. Please try again.');
  }
};

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

// Multi-Step Signup Dialog Component
function MultiStepSignupDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
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

  const availableDomains = [
    'Artificial Intelligence', 'Machine Learning', 'Blockchain', 'IoT', 'Cybersecurity',
    'Biotechnology', 'Healthcare', 'FinTech', 'EdTech', 'AgriTech', 'CleanTech',
    'Robotics', 'Data Science', 'Cloud Computing', 'Mobile Development', 'Web Development',
    'DevOps', 'UI/UX Design', 'Product Management', 'Digital Marketing', 'E-commerce',
    'Gaming', 'AR/VR', 'Quantum Computing', 'Nanotechnology', 'Renewable Energy'
  ];

  const totalSteps = 6;

  const resetForm = () => {
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
    setCurrentStep(1);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateCurrentStep = () => {
    const errors: Record<string, string> = {};

    switch (currentStep) {
      case 1: // Basic Info
        if (!signupForm.fullName?.trim()) {
          errors.fullName = 'Full name is required';
        } else if (signupForm.fullName.trim().length < 2) {
          errors.fullName = 'Full name must be at least 2 characters';
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!signupForm.email) {
          errors.email = 'Email is required';
        } else if (!emailRegex.test(signupForm.email)) {
          errors.email = 'Please enter a valid email address';
        }
        break;

      case 2: // Password
        if (!signupForm.password) {
          errors.password = 'Password is required';
        } else if (signupForm.password.length < 8) {
          errors.password = 'Password must be at least 8 characters';
        }

        if (!signupForm.confirmPassword) {
          errors.confirmPassword = 'Please confirm your password';
        } else if (signupForm.password !== signupForm.confirmPassword) {
          errors.confirmPassword = 'Passwords do not match';
        }
        break;

      case 3: // Role & Organization
        if (!signupForm.role) {
          errors.role = 'Please select your role';
        }
        if (!signupForm.organization?.trim()) {
          errors.organization = 'Organization/Institute name is required';
        }
        break;

      case 4: // Domains
        if (selectedDomains.length === 0) {
          errors.domains = 'Please select at least one domain of interest';
        }
        break;

      case 5: // Social Links & Bio
        if (signupForm.linkedinUrl && !signupForm.linkedinUrl.includes('linkedin.com')) {
          errors.linkedinUrl = 'Please enter a valid LinkedIn URL';
        }

        const urlRegex = /^https?:\/\/.+/;
        if (signupForm.portfolioUrl && !urlRegex.test(signupForm.portfolioUrl)) {
          errors.portfolioUrl = 'Please enter a valid URL (starting with http:// or https://)';
        }

        if (signupForm.bio && signupForm.bio.length > 200) {
          errors.bio = 'Bio must be 200 characters or less';
        }
        break;

      case 6: // Profile Photo (optional)
        // No validation needed for profile photo as it's optional
        break;
    }

    setSignupErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setSignupErrors({});
    }
  };

  const handleDomainToggle = (domain: string) => {
    setSelectedDomains(prev => {
      if (prev.includes(domain)) {
        return prev.filter(d => d !== domain);
      } else {
        return [...prev, domain];
      }
    });
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const userData = {
        ...signupForm,
        domains: selectedDomains
      };

      const result = await createUser(userData);

      // Reset form and close dialog
      resetForm();
      handleClose();

      // Show success message
      alert('Account created successfully! Please check your email for verification.');

    } catch (error: unknown) {
      console.error('Signup error:', error);

      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

      if (errorMessage.includes('User already registered')) {
        setCurrentStep(1);
        setSignupErrors(prev => ({
          ...prev,
          email: 'An account with this email already exists'
        }));
      } else if (errorMessage.includes('Password')) {
        setCurrentStep(2);
        setSignupErrors(prev => ({
          ...prev,
          password: errorMessage
        }));
      } else if (errorMessage.includes('profile picture')) {
        setCurrentStep(6);
        setSignupErrors(prev => ({
          ...prev,
          profilePhoto: 'Failed to upload profile picture. Please try again.'
        }));
      } else {
        alert('Signup failed: ' + errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Basic Information';
      case 2: return 'Create Password';
      case 3: return 'Professional Details';
      case 4: return 'Domains of Interest';
      case 5: return 'Social Links & Bio';
      case 6: return 'Profile Picture';
      default: return 'Sign Up';
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
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
            <div>
              <Label htmlFor="signupEmail">Email *</Label>
              <Input
                id="signupEmail"
                type="email"
                value={signupForm.email}
                onChange={(e) => setSignupForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Enter your email"
                className={signupErrors.email ? 'border-red-500' : ''}
              />
              {signupErrors.email && (
                <p className="text-red-500 text-sm mt-1">{signupErrors.email}</p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="signupPassword">Password *</Label>
              <Input
                id="signupPassword"
                type="password"
                value={signupForm.password}
                onChange={(e) => setSignupForm(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Create a secure password"
                className={signupErrors.password ? 'border-red-500' : ''}
              />
              {signupErrors.password && (
                <p className="text-red-500 text-sm mt-1">{signupErrors.password}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">Password must be at least 8 characters</p>
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={signupForm.confirmPassword}
                onChange={(e) => setSignupForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                placeholder="Confirm your password"
                className={signupErrors.confirmPassword ? 'border-red-500' : ''}
              />
              {signupErrors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{signupErrors.confirmPassword}</p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
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
            <div>
              <Label htmlFor="organization">Organization/Institute *</Label>
              <Input
                id="organization"
                value={signupForm.organization}
                onChange={(e) => setSignupForm(prev => ({ ...prev, organization: e.target.value }))}
                placeholder="Enter your organization or institute"
                className={signupErrors.organization ? 'border-red-500' : ''}
              />
              {signupErrors.organization && (
                <p className="text-red-500 text-sm mt-1">{signupErrors.organization}</p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label>Domains of Interest *</Label>
              <p className="text-sm text-gray-500 mb-3">Select all domains that interest you</p>
              <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto border rounded p-3">
                {availableDomains.map((domain) => (
                  <div key={domain} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`domain-${domain}`}
                      checked={selectedDomains.includes(domain)}
                      onChange={() => handleDomainToggle(domain)}
                      className="rounded"
                    />
                    <label htmlFor={`domain-${domain}`} className="text-sm cursor-pointer">
                      {domain}
                    </label>
                  </div>
                ))}
              </div>
              {selectedDomains.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Selected domains:</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedDomains.map((domain) => (
                      <Badge key={domain} variant="secondary" className="text-xs">
                        {domain}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {signupErrors.domains && (
                <p className="text-red-500 text-sm mt-1">{signupErrors.domains}</p>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
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
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Add a profile picture to help others recognize you (optional)
              </p>
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
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{getStepTitle()}</span>
            <span className="text-sm text-gray-500">
              {currentStep}/{totalSteps}
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {renderStepContent()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : currentStep === totalSteps ? (
              'Create Account'
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [loginForm, setLoginForm] = useState<LoginForm>({ email: '', password: '' });
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [showSignupFlow, setShowSignupFlow] = useState<boolean>(false);

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
      // Call loginUser and handle the response without expecting a profile property
      const result = await loginUser(loginForm.email, loginForm.password);

      setIsLoggedIn(true);

      // Fetch user profile separately if loginUser returns a user
      if (result.user) {
        try {
          const { data: profileData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', result.user.id)
            .single();

          if (!error && profileData) {
            setCurrentUser(profileData);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }

      setLoginForm({ email: '', password: '' });
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      alert('Login failed: ' + errorMessage);
    } finally {
      setLoginLoading(false);
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

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <header className="p-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">StartLink</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="p-2"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Connect. Collaborate. Create.
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Join the premier platform for startups and innovators
              </p>

              {/* Login/Signup Buttons */}
              <div className="flex justify-center space-x-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="px-8">
                      Sign In
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

                <Button
                  variant="outline"
                  size="lg"
                  className="px-8"
                  onClick={() => setShowSignupFlow(true)}
                >
                  Sign Up
                </Button>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 mb-4"
                  onClick={handleGoogleSignIn}
                >
                  <FcGoogle className="w-5 h-5" />
                  Sign in with Google
                </Button>
              </div>
            </div>

            {/* Features Section */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <Card className="p-6 text-center">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Connect</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Find like-minded entrepreneurs and build meaningful connections
                </p>
              </Card>
              <Card className="p-6 text-center">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your data is protected with enterprise-grade security
                </p>
              </Card>
              <Card className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Grow</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Access resources and tools to scale your startup
                </p>
              </Card>
            </div>
          </div>
        </main>

        {/* Multi-Step Signup Flow */}
        <MultiStepSignupDialog
          isOpen={showSignupFlow}
          onClose={() => setShowSignupFlow(false)}
        />
      </div>
    </div>
  );
}