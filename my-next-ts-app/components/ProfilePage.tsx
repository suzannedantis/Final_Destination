'use client';
import { supabase } from '@/lib/supabase';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  User,
  Edit,
  Plus,
  Calendar,
  MapPin,
  Mail,
  Building,
  FolderOpen,
  Rocket,
  FileText,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  Trophy,
  Users,
  Code,
  BookOpen,
  Github,
  Linkedin,
  UserCircle
} from 'lucide-react';

interface UserData {
  user_id: string;
  created_at: string;
  full_name: string;
  email: string;
  password: string;
  role: string;
  organization: string;
  domain_of_interest: string[];
  linkedin?: string | null;
  github?: string | null;
  bio?: string | null;
  profile_pic?: string | null;
}

interface ProfilePageProps {
  userId?: string;
}

export default function ProfilePage({ userId = "1" }: ProfilePageProps) {
  
  const [full_name, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [organization, setOrganization] = useState('');
  const [domain_of_interest, setDomainOfInterest] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [activeTab, setActiveTab] = useState('projects');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data from database
  useEffect(() => {
  console.log('🔍 userData:', userData);
  if (userData) {
    setFullName(userData.full_name);
    setRole(userData.role);
    setOrganization(userData.organization);
    setDomainOfInterest(userData.domain_of_interest); // Check type here!
    setBio(userData.bio || '');
    setLinkedin(userData.linkedin || '');
    setGithub(userData.github || '');
  }
}, [userData]);


 useEffect(() => {
  const checkAndSetUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    const userId = session?.user?.id;
    console.log('🧑 Logged-in User ID:', userId); // ✅ Log the user ID

    if (userId) {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', userId)
        .single(); // Consider using `.maybeSingle()` if row might not exist

      if (error) {
        console.error('❌ Error fetching user:', error);
      } else {
        console
        setUserData(userData);
        console.log('✅ User data fetched:', userData); // ✅ Log the user data

      }
    }
  };

  checkAndSetUser();
}, []);




  const tabs = [
    { id: 'projects', label: 'Projects / Research', icon: <FolderOpen className="w-4 h-4" /> },
    { id: 'startups', label: 'Startups', icon: <Rocket className="w-4 h-4" /> },
    { id: 'ipr', label: 'IPR Filed', icon: <FileText className="w-4 h-4" /> },
    { id: 'posts', label: 'Posts', icon: <MessageSquare className="w-4 h-4" /> }
  ];

  const mockProjects = [
    {
      id: 1,
      title: 'AI-Powered Smart Agriculture System',
      status: 'In Progress',
      description: 'Developing machine learning algorithms for crop yield prediction and pest detection using IoT sensors and drone imagery.',
      tags: ['AI', 'IoT', 'Agriculture', 'Machine Learning'],
      startDate: '2024-01-15',
      collaborators: 5,
      progress: 75
    },
    {
      id: 2,
      title: 'Sustainable Energy Storage Solutions',
      status: 'Completed',
      description: 'Research on advanced battery technologies using eco-friendly materials for renewable energy storage.',
      tags: ['Battery Tech', 'Renewable Energy', 'Materials Science'],
      startDate: '2023-08-01',
      collaborators: 8,
      progress: 100
    },
    {
      id: 3,
      title: 'Blockchain-Based Supply Chain',
      status: 'Planning',
      description: 'Designing a transparent and secure supply chain management system using blockchain technology.',
      tags: ['Blockchain', 'Supply Chain', 'Security'],
      startDate: '2024-03-01',
      collaborators: 3,
      progress: 20
    }
  ];

  const mockStartups = [
    {
      id: 1,
      name: 'TechVenture AI',
      role: 'Co-Founder & CTO',
      stage: 'Seed Funding',
      description: 'AI-powered business intelligence platform for SMEs',
      tags: ['AI', 'B2B', 'Analytics'],
      founded: '2023-06-15',
      teamSize: 12,
      funding: '$500K'
    },
    {
      id: 2,
      name: 'GreenTech Solutions',
      role: 'Technical Advisor',
      stage: 'Series A',
      description: 'Sustainable technology solutions for urban environments',
      tags: ['GreenTech', 'Urban Planning', 'Sustainability'],
      founded: '2022-03-10',
      teamSize: 25,
      funding: '$2.5M'
    }
  ];

  const mockIPR = [
    {
      id: 1,
      type: 'Patent',
      title: 'Machine Learning Algorithm for Crop Yield Prediction',
      status: 'Granted',
      applicationNumber: 'IN202341025789',
      filedDate: '2023-04-15',
      grantedDate: '2024-01-20'
    },
    {
      id: 2,
      type: 'Trademark',
      title: 'TechVenture AI Logo',
      status: 'Under Examination',
      applicationNumber: 'TM202341054321',
      filedDate: '2023-08-10',
      grantedDate: null
    }
  ];

  const mockPosts = [
    {
      id: 1,
      title: 'Exciting breakthrough in AI-powered agriculture!',
      content: 'Our team has successfully developed a machine learning model that can predict crop yields with 95% accuracy.',
      tags: ['#AI', '#Agriculture', '#Innovation'],
      timestamp: '2024-01-15T10:30:00Z',
      likes: 45,
      comments: 12
    },
    {
      id: 2,
      title: 'Patent granted for our innovative crop prediction system',
      content: 'Proud to announce that our patent application for the AI-powered crop yield prediction system has been granted!',
      tags: ['#Patent', '#IPR', '#Achievement'],
      timestamp: '2024-01-20T14:22:00Z',
      likes: 78,
      comments: 23
    }
  ];

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Planning': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'Granted': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Under Examination': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'Registered': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Seed Funding': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Series A': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'In Progress': <Clock className="w-4 h-4" />,
      'Completed': <CheckCircle className="w-4 h-4" />,
      'Planning': <AlertCircle className="w-4 h-4" />,
      'Granted': <Trophy className="w-4 h-4" />,
      'Under Examination': <Clock className="w-4 h-4" />,
      'Registered': <CheckCircle className="w-4 h-4" />
    };
    return icons[status] || <AlertCircle className="w-4 h-4" />;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'projects':
        return (
          <div className="space-y-6">
            {mockProjects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{project.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Started {new Date(project.startDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {project.collaborators} collaborators
                        </div>
                        <div className="flex items-center">
                          <Code className="w-4 h-4 mr-1" />
                          {project.progress}% complete
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(project.status)}
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Plus className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-gray-600 dark:text-gray-300 font-medium">Add Project/Research</p>
              </CardContent>
            </Card>
          </div>
        );

      case 'startups':
        return (
          <div className="space-y-6">
            {mockStartups.map((startup) => (
              <Card key={startup.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{startup.name}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {startup.role}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Founded {new Date(startup.founded).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {startup.teamSize} team members
                        </div>
                        <div className="flex items-center">
                          <Trophy className="w-4 h-4 mr-1" />
                          {startup.funding} raised
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(startup.stage)}>
                      {startup.stage}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{startup.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {startup.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Plus className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-gray-600 dark:text-gray-300 font-medium">Add Startup</p>
              </CardContent>
            </Card>
          </div>
        );

      case 'ipr':
        return (
          <div className="space-y-6">
            {mockIPR.map((ipr) => (
              <Card key={ipr.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{ipr.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          {ipr.type}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Filed {new Date(ipr.filedDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="w-4 h-4 mr-1" />
                          {ipr.applicationNumber}
                        </div>
                        {ipr.grantedDate && (
                          <div className="flex items-center">
                            <Trophy className="w-4 h-4 mr-1" />
                            Granted {new Date(ipr.grantedDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(ipr.status)}
                      <Badge className={getStatusColor(ipr.status)}>
                        {ipr.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Plus className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-gray-600 dark:text-gray-300 font-medium">Add IPR</p>
              </CardContent>
            </Card>
          </div>
        );

      case 'posts':
        return (
          <div className="space-y-6">
            {mockPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(post.timestamp).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {post.likes} likes
                        </div>
                        <div className="flex items-center">
                          <MessageSquare className="w-4 h-4 mr-1" />
                          {post.comments} comments
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">{post.content}</p>
                </CardContent>
              </Card>
            ))}
            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Plus className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-gray-600 dark:text-gray-300 font-medium">Add Post</p>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  if (error && !userData) {
    return (
      <div className="max-w-6xl mx-auto">
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Profile</h2>
              <p className="text-gray-600 dark:text-gray-300">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              {userData?.profile_pic ? (
                <img
                  src={userData.profile_pic}
                  alt={userData.full_name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <UserCircle className="w-12 h-12 text-white" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{userData?.full_name}</h1>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">{userData?.role}</p>
                </div>
                <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>

                    {userData && (
                      <form
                        onSubmit={async (e) => {
                          e.preventDefault();
                          const updatedData = {
                            full_name,
                            role,
                            organization,
                            domain_of_interest,
                            bio,
                            linkedin,
                            github,
                          };

                          const res = await fetch(`/api/users/${userId}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(updatedData),
                          });
                          const result = await res.json();

                          if (res.ok) {
                            alert('Profile updated');
                            setUserData({ ...userData, ...updatedData });
                            setShowEditProfile(false);
                          } else {
                            alert(`Error: ${result.error}`);
                          }
                        }}
                        className="space-y-4"
                      >
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" value={full_name} onChange={(e) => setFullName(e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor="role">Role</Label>
                          <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor="organization">Organization</Label>
                          <Input id="organization" value={organization} onChange={(e) => setOrganization(e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor="domain">Domain of Interest</Label>
                          <Input
  id="domain"
  value={domain_of_interest.join(', ')} // show as string
  onChange={(e) => setDomainOfInterest(e.target.value.split(',').map(s => s.trim()))}
/>
                        </div>
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor="linkedin">LinkedIn URL</Label>
                          <Input id="linkedin" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor="github">GitHub URL</Label>
                          <Input id="github" value={github} onChange={(e) => setGithub(e.target.value)} />
                        </div>
                        <Button type="submit" className="w-full">Save Changes</Button>
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-4">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">{userData?.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">{userData?.organization}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Joined {new Date(userData?.created_at || '').toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center space-x-4 mb-4">
                {userData?.linkedin && (
                  <a
                    href={userData.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span className="text-sm">LinkedIn</span>
                  </a>
                )}
                {userData?.github && (
                  <a
                    href={userData.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    <span className="text-sm">GitHub</span>
                  </a>
                )}
              </div>

              {/* Domain of Interest */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Domain of Interest</h3>
                <div className="flex flex-wrap gap-2">
                  {userData?.domain_of_interest?.map((domain, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {domain.trim()}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <p className="text-gray-600 dark:text-gray-300">
                {userData?.bio || 'No bio available'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-6 border-b border-gray-200 dark:border-gray-700">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 font-medium transition-colors ${activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
}