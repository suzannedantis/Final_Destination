'use client';

import { useState, FormEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addProject, getProjectsByUserId } from '@/lib/projectService';
import { addStartup, getStartupsByUserId } from '@/lib/startupService';
import { addPost, getPostsByUserId } from '@/lib/postService';
import { supabase } from '@/lib/supabase';
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
  Loader2,
  Sparkles,
  Star,
  ExternalLink
} from 'lucide-react';

interface ProfilePageProps {
  user: any;
}

// Data interfaces
interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  tags: string[];
  yearOfPublishing: string;
  authors: string[];
  journal?: string;
  types: string[] | string;
  status: string;
  visibility: string;
  document_url?: string;
}

interface Startup {
  id: number;
  name: string;
  idea_summary: string;
  stage: string;
  funding_status: string;
  website: string;
  pitch_deck_url: string;
  registered_on: string;
}

interface IPR {
  id: number;
  type: string;
  title: string;
  status: string;
  applicationNumber: string;
  filedDate: string;
  grantedDate: string | null;
}

interface Post {
    id: number;
    content: string;
    media_urls?: string;
    post_type: string[];
    tags: string[];
    created_at: string;
}

export default function ProfilePage({ user: initialUser }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState('projects');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(!initialUser);

  // Form visibility states
  const [showAddProjectForm, setShowAddProjectForm] = useState(false);
  const [showAddStartupForm, setShowAddStartupForm] = useState(false);
  const [showAddIprForm, setShowAddIprForm] = useState(false);
  const [showAddPostForm, setShowAddPostForm] = useState(false);

  // Data states
  const [projects, setProjects] = useState<Project[]>([]);
  const [startups, setStartups] = useState<Startup[]>([]);
  const [iprs, setIprs] = useState<IPR[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);

  // Form data states
  const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({ title: '', description: '', category: '', tags: [], yearOfPublishing: '', authors: [], journal: '', types: [], status: '', visibility: 'Public', document_url: '' });
  const [newStartup, setNewStartup] = useState<Omit<Startup, 'id'>>({ name: '', idea_summary: '', stage: '', funding_status: '', website: '', pitch_deck_url: '', registered_on: '' });
  const [newIpr, setNewIpr] = useState<Omit<IPR, 'id'>>({ type: '', title: '', status: '', applicationNumber: '', filedDate: '', grantedDate: null });
  const [newPost, setNewPost] = useState<Omit<Post, 'id' | 'created_at'>>({ content: '', media_urls: '', post_type: [], tags: [] });
  const [fileError, setFileError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setCurrentUserId(authUser.id);
        setLoading(true);
        const { data: profileData, error } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', authUser.id)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user profile:', error);
        } else if (profileData) {
          setUser(profileData);
          const userProjects = await getProjectsByUserId(authUser.id);
          setProjects(userProjects);
          const userStartups = await getStartupsByUserId(authUser.id);
          setStartups(userStartups);
          const userPosts = await getPostsByUserId(authUser.id);
          setPosts(userPosts);
        }
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [initialUser]);

  const tabs = [
    { id: 'projects', label: 'Projects / Research', icon: <FolderOpen className="w-4 h-4" />, count: projects.length },
    { id: 'startups', label: 'Startups', icon: <Rocket className="w-4 h-4" />, count: startups.length },
    { id: 'ipr', label: 'IPR Filed', icon: <FileText className="w-4 h-4" />, count: iprs.length },
    { id: 'posts', label: 'Posts', icon: <MessageSquare className="w-4 h-4" />, count: posts.length }
  ];

  const handleAddProject = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUserId) {
      setFileError("You must be logged in to add a project.");
      return;
    }
    setIsLoading(true);
    try {
      const projectData = {
        ...newProject,
        author_name: user?.full_name || 'Anonymous'
      };
      const newProjectData = await addProject(projectData, currentUserId);
      setProjects(prev => [newProjectData, ...prev]);
      setNewProject({ title: '', description: '', category: '', tags: [], yearOfPublishing: '', authors: [], journal: '', types: [], status: '', visibility: 'Public', document_url: '' });
      setShowAddProjectForm(false);
    } catch (error: any) {
      setFileError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStartup = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUserId) return;
    setIsLoading(true);
    try {
      const newStartupData = await addStartup(newStartup, currentUserId);
      setStartups(prev => [newStartupData, ...prev]);
      setNewStartup({ name: '', idea_summary: '', stage: '', funding_status: '', website: '', pitch_deck_url: '', registered_on: '' });
      setShowAddStartupForm(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddIpr = (e: FormEvent) => {
    e.preventDefault();
    setIprs(prev => [{ ...newIpr, id: Date.now() }, ...prev]);
    setNewIpr({ type: '', title: '', status: '', applicationNumber: '', filedDate: '', grantedDate: null });
    setShowAddIprForm(false);
  };

  const handleAddPost = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUserId) return;
    setIsLoading(true);
    try {
      const newPostData = await addPost(newPost, currentUserId);
      setPosts(prev => [newPostData, ...prev]);
      setNewPost({ content: '', media_urls: '', post_type: [], tags: [] });
      setShowAddPostForm(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Planning': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'Granted': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Under Examination': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'Registered': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Seed Funding': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Series A': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'On Hold': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
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
      'Registered': <CheckCircle className="w-4 h-4" />,
      'On Hold': <AlertCircle className="w-4 h-4" />,
      'Cancelled': <AlertCircle className="w-4 h-4" />
    };
    return icons[status] || <AlertCircle className="w-4 h-4" />;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'projects':
        return (
          <div className="space-y-6">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="hover:shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border-2 border-transparent hover:border-indigo-300 dark:hover:border-indigo-500 transition duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{project.title}</CardTitle>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Published in {project.yearOfPublishing}
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {project.authors.join(', ')}
                          </div>
                          {project.journal && (
                            <div className="flex items-center">
                              <BookOpen className="w-4 h-4 mr-1" />
                              {project.journal}
                            </div>
                          )}
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
                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{project.description}</p>
                    {project.document_url && (
                      <p className="text-sm text-gray-500 mb-4 flex items-center">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Document: <a href={project.document_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">View Document</a>
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {(typeof project.types === 'string' ? project.types.split(',') : project.types).map((type, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {type.trim()}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="text-xs">{project.category}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {showAddProjectForm ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-2 border-indigo-200 dark:border-indigo-700">
                  <CardHeader className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-t-lg">
                    <CardTitle className="flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-indigo-600" />
                      Add New Project/Research
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <form onSubmit={handleAddProject} className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title *</Label>
                        <Input id="title" placeholder="Title" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} required className="bg-white/50 dark:bg-slate-700/50" />
                      </div>
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select onValueChange={value => setNewProject({...newProject, category: value})} required>
                          <SelectTrigger id="category" className="bg-white/50 dark:bg-slate-700/50">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Research">Research</SelectItem>
                            <SelectItem value="Project">Project</SelectItem>
                            <SelectItem value="Thesis">Thesis</SelectItem>
                            <SelectItem value="Innovation">Innovation</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="description">Description/Abstract *</Label>
                        <Textarea id="description" placeholder="A brief description of your project or research." value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} required className="bg-white/50 dark:bg-slate-700/50" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="tags">Tags (comma separated)</Label>
                          <Input id="tags" placeholder="e.g., AI, Machine Learning, NLP" onChange={e => setNewProject({...newProject, tags: e.target.value.split(',').map(t => t.trim())})} className="bg-white/50 dark:bg-slate-700/50" />
                        </div>
                        <div>
                          <Label htmlFor="year">Year of Publishing *</Label>
                          <Input id="year" placeholder="e.g., 2023" value={newProject.yearOfPublishing} onChange={e => setNewProject({...newProject, yearOfPublishing: e.target.value})} required className="bg-white/50 dark:bg-slate-700/50" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="authors">Authors (comma separated) *</Label>
                        <Input id="authors" placeholder="e.g., John Doe, Jane Smith" onChange={e => setNewProject({...newProject, authors: e.target.value.split(',').map(t => t.trim())})} required className="bg-white/50 dark:bg-slate-700/50" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="journal">Journal</Label>
                          <Input id="journal" placeholder="e.g., Nature, IEEE" value={newProject.journal || ''} onChange={e => setNewProject({...newProject, journal: e.target.value})} className="bg-white/50 dark:bg-slate-700/50" />
                        </div>
                        <div>
                          <Label htmlFor="types">Types (comma separated)</Label>
                          <Input id="types" placeholder="e.g., Research Paper, High Impact" onChange={e => setNewProject({...newProject, types: e.target.value.split(',').map(t => t.trim())})} className="bg-white/50 dark:bg-slate-700/50" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="status">Status *</Label>
                          <Select onValueChange={value => setNewProject({...newProject, status: value})} required>
                            <SelectTrigger id="status" className="bg-white/50 dark:bg-slate-700/50">
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Planning">Planning</SelectItem>
                              <SelectItem value="In Progress">In Progress</SelectItem>
                              <SelectItem value="Completed">Completed</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Visibility</Label>
                          <Select onValueChange={value => setNewProject({...newProject, visibility: value})} defaultValue="Public">
                            <SelectTrigger className="bg-white/50 dark:bg-slate-700/50">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Public">Public</SelectItem>
                              <SelectItem value="Private">Private</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>Document URL</Label>
                        <Input
                          type="url"
                          value={newProject.document_url}
                          onChange={(e) => setNewProject({...newProject, document_url: e.target.value})}
                          placeholder="https://drive.google.com/file/d/..."
                          className="bg-white/50 dark:bg-slate-700/50"
                        />
                        {fileError && <p className="text-sm text-red-600 mt-1">{fileError}</p>}
                      </div>
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setShowAddProjectForm(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-2" />
                              Add Project
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Card onClick={() => setShowAddProjectForm(true)} className="border-2 border-dashed border-indigo-300 dark:border-indigo-600 hover:border-indigo-400 dark:hover:border-indigo-500 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/50 dark:to-purple-950/50 transition-all duration-300 cursor-pointer group">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Plus className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">Add Project/Research</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Share your research and projects with the community</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        );

      case 'startups':
        return (
          <div className="space-y-6">
            {startups.map((startup) => (
              <motion.div
                key={startup.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="hover:shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border-2 border-transparent hover:border-emerald-300 dark:hover:border-emerald-500 transition duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white mb-1 flex items-center">
                          <Rocket className="w-5 h-5 mr-2 text-emerald-600" />
                          {startup.name}
                        </CardTitle>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Registered {new Date(startup.registered_on).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <Trophy className="w-4 h-4 mr-1" />
                            {startup.funding_status}
                          </div>
                          {startup.website && (
                            <div className="flex items-center">
                              <ExternalLink className="w-4 h-4 mr-1" />
                              <a href={startup.website} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Website</a>
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge className={`${getStatusColor(startup.stage)} border-emerald-200`}>
                        {startup.stage}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{startup.idea_summary}</p>
                    {startup.pitch_deck_url && (
                      <p className="text-sm text-emerald-600 hover:text-emerald-800">
                        <a href={startup.pitch_deck_url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          View Pitch Deck
                        </a>
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {showAddStartupForm ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-2 border-emerald-200 dark:border-emerald-700">
                  <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-t-lg">
                    <CardTitle className="flex items-center">
                      <Rocket className="w-5 h-5 mr-2 text-emerald-600" />
                      Add New Startup
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <form onSubmit={handleAddStartup} className="space-y-4">
                      <div>
                        <Label htmlFor="startup-name">Startup Name *</Label>
                        <Input id="startup-name" placeholder="Startup Name" value={newStartup.name} onChange={e => setNewStartup({...newStartup, name: e.target.value})} required className="bg-white/50 dark:bg-slate-700/50" />
                      </div>
                      <div>
                        <Label htmlFor="idea-summary">Idea Summary *</Label>
                        <Textarea id="idea-summary" placeholder="Brief description of your startup idea" value={newStartup.idea_summary} onChange={e => setNewStartup({...newStartup, idea_summary: e.target.value})} required className="bg-white/50 dark:bg-slate-700/50" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="website">Website</Label>
                          <Input id="website" placeholder="https://..." value={newStartup.website} onChange={e => setNewStartup({...newStartup, website: e.target.value})} className="bg-white/50 dark:bg-slate-700/50" />
                        </div>
                        <div>
                          <Label htmlFor="pitch-deck">Pitch Deck URL</Label>
                          <Input id="pitch-deck" placeholder="https://..." value={newStartup.pitch_deck_url} onChange={e => setNewStartup({...newStartup, pitch_deck_url: e.target.value})} className="bg-white/50 dark:bg-slate-700/50" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="registered-date">Registered On *</Label>
                          <Input id="registered-date" type="date" value={newStartup.registered_on} onChange={e => setNewStartup({...newStartup, registered_on: e.target.value})} required className="bg-white/50 dark:bg-slate-700/50" />
                        </div>
                        <div>
                          <Label htmlFor="funding-status">Funding Status *</Label>
                          <Input id="funding-status" placeholder="e.g., Bootstrap, Seed, Series A" value={newStartup.funding_status} onChange={e => setNewStartup({...newStartup, funding_status: e.target.value})} required className="bg-white/50 dark:bg-slate-700/50" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="startup-stage">Stage *</Label>
                        <Select onValueChange={value => setNewStartup({...newStartup, stage: value})} required>
                          <SelectTrigger id="startup-stage" className="bg-white/50 dark:bg-slate-700/50">
                            <SelectValue placeholder="SelectStage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Idea">Idea</SelectItem>
                            <SelectItem value="MVP">MVP</SelectItem>
                            <SelectItem value="Pre-Revenue">Pre-Revenue</SelectItem>
                            <SelectItem value="Revenue">Revenue</SelectItem>
                            <SelectItem value="Growth">Growth</SelectItem>
                            <SelectItem value="Scale">Scale</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setShowAddStartupForm(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-2" />
                              Add Startup
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Card onClick={() => setShowAddStartupForm(true)} className="border-2 border-dashed border-emerald-300 dark:border-emerald-600 hover:border-emerald-400 dark:hover:border-emerald-500 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/50 dark:to-teal-950/50 transition-all duration-300 cursor-pointer group">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Rocket className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">Add Startup</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Share your entrepreneurial journey</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        );

      case 'ipr':
        return (
          <div className="space-y-6">
            {iprs.map((ipr) => (
              <motion.div
                key={ipr.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="hover:shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border-2 border-transparent hover:border-orange-300 dark:hover:border-orange-500 transition duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white mb-1 flex items-center">
                          <FileText className="w-5 h-5 mr-2 text-orange-600" />
                          {ipr.title}
                        </CardTitle>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
                          <div className="flex items-center">
                            <Code className="w-4 h-4 mr-1" />
                            {ipr.type}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Filed: {new Date(ipr.filedDate).toLocaleDateString()}
                          </div>
                          {ipr.grantedDate && (
                            <div className="flex items-center">
                              <Trophy className="w-4 h-4 mr-1" />
                              Granted: {new Date(ipr.grantedDate).toLocaleDateString()}
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
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 mb-4">
                      <span className="font-medium">Application Number:</span> {ipr.applicationNumber}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {showAddIprForm ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-2 border-orange-200 dark:border-orange-700">
                  <CardHeader className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-t-lg">
                    <CardTitle className="flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-orange-600" />
                      Add New IPR
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <form onSubmit={handleAddIpr} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="ipr-type">IPR Type *</Label>
                          <Select onValueChange={value => setNewIpr({...newIpr, type: value})} required>
                            <SelectTrigger id="ipr-type" className="bg-white/50 dark:bg-slate-700/50">
                              <SelectValue placeholder="Select Type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Patent">Patent</SelectItem>
                              <SelectItem value="Copyright">Copyright</SelectItem>
                              <SelectItem value="Trademark">Trademark</SelectItem>
                              <SelectItem value="Design">Design</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="ipr-status">Status *</Label>
                          <Select onValueChange={value => setNewIpr({...newIpr, status: value})} required>
                            <SelectTrigger id="ipr-status" className="bg-white/50 dark:bg-slate-700/50">
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Under Examination">Under Examination</SelectItem>
                              <SelectItem value="Granted">Granted</SelectItem>
                              <SelectItem value="Registered">Registered</SelectItem>
                              <SelectItem value="On Hold">On Hold</SelectItem>
                              <SelectItem value="Cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="ipr-title">Title *</Label>
                        <Input id="ipr-title" placeholder="IPR Title" value={newIpr.title} onChange={e => setNewIpr({...newIpr, title: e.target.value})} required className="bg-white/50 dark:bg-slate-700/50" />
                      </div>
                      <div>
                        <Label htmlFor="application-number">Application Number *</Label>
                        <Input id="application-number" placeholder="Application Number" value={newIpr.applicationNumber} onChange={e => setNewIpr({...newIpr, applicationNumber: e.target.value})} required className="bg-white/50 dark:bg-slate-700/50" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="filed-date">Filed Date *</Label>
                          <Input id="filed-date" type="date" value={newIpr.filedDate} onChange={e => setNewIpr({...newIpr, filedDate: e.target.value})} required className="bg-white/50 dark:bg-slate-700/50" />
                        </div>
                        <div>
                          <Label htmlFor="granted-date">Granted Date</Label>
                          <Input id="granted-date" type="date" value={newIpr.grantedDate || ''} onChange={e => setNewIpr({...newIpr, grantedDate: e.target.value || null})} className="bg-white/50 dark:bg-slate-700/50" />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setShowAddIprForm(false)}>Cancel</Button>
                        <Button type="submit" className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Add IPR
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Card onClick={() => setShowAddIprForm(true)} className="border-2 border-dashed border-orange-300 dark:border-orange-600 hover:border-orange-400 dark:hover:border-orange-500 bg-gradient-to-br from-orange-50/50 to-red-50/50 dark:from-orange-950/50 dark:to-red-950/50 transition-all duration-300 cursor-pointer group">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">Add IPR</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">File your intellectual property rights</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        );

      case 'posts':
        return (
          <div className="space-y-6">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Card className="hover:shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-500 transition duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap gap-2 mb-2">
                          {post.post_type.map((type, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(post.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{post.content}</p>
                    {post.media_urls && (
                      <div className="mb-4">
                        <img src={post.media_urls} alt="Post media" className="rounded-lg max-w-full h-auto" />
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            {showAddPostForm ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-2 border-blue-200 dark:border-blue-700">
                  <CardHeader className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-t-lg">
                    <CardTitle className="flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                      Add New Post
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <form onSubmit={handleAddPost} className="space-y-4">
                      <div>
                        <Label htmlFor="post-content">Content *</Label>
                        <Textarea id="post-content" placeholder="What's on your mind?" value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} required className="bg-white/50 dark:bg-slate-700/50 min-h-[100px]" />
                      </div>
                      <div>
                        <Label htmlFor="media-url">Media URL</Label>
                        <Input id="media-url" placeholder="https://..." value={newPost.media_urls} onChange={e => setNewPost({...newPost, media_urls: e.target.value})} className="bg-white/50 dark:bg-slate-700/50" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="post-types">Post Types (comma separated)</Label>
                          <Input id="post-types" placeholder="e.g., Update, Achievement, Question" onChange={e => setNewPost({...newPost, post_type: e.target.value.split(',').map(t => t.trim())})} className="bg-white/50 dark:bg-slate-700/50" />
                        </div>
                        <div>
                          <Label htmlFor="post-tags">Tags (comma separated)</Label>
                          <Input id="post-tags" placeholder="e.g., research, startup, innovation" onChange={e => setNewPost({...newPost, tags: e.target.value.split(',').map(t => t.trim())})} className="bg-white/50 dark:bg-slate-700/50" />
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="ghost" onClick={() => setShowAddPostForm(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700">
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Posting...
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-2" />
                              Add Post
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Card onClick={() => setShowAddPostForm(true)} className="border-2 border-dashed border-blue-300 dark:border-blue-600 hover:border-blue-400 dark:hover:border-blue-500 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/50 dark:to-cyan-950/50 transition-all duration-300 cursor-pointer group">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <MessageSquare className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">Add Post</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Share updates and connect with others</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      <User className="w-12 h-12" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {user?.full_name || 'User Name'}
                    </h1>
                    <div className="flex flex-wrap gap-4 text-gray-600 dark:text-gray-300 mb-3">
                      {user?.email && (
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          {user.email}
                        </div>
                      )}
                      {user?.institution && (
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-2" />
                          {user.institution}
                        </div>
                      )}
                      {user?.location && (
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2" />
                          {user.location}
                        </div>
                      )}
                    </div>
                    {user?.bio && (
                      <p className="text-gray-700 dark:text-gray-300 max-w-2xl leading-relaxed">
                        {user.bio}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => setShowEditProfile(true)}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="mb-8 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border-0 shadow-lg">
            <CardContent className="p-2">
              <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    {tab.icon}
                    <span className="ml-2">{tab.label}</span>
                    <Badge
                      variant={activeTab === tab.id ? "secondary" : "outline"}
                      className={`ml-2 ${
                        activeTab === tab.id
                          ? 'bg-white/20 text-white border-white/30'
                          : ''
                      }`}
                    >
                      {tab.count}
                    </Badge>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditProfile} onOpenChange={setShowEditProfile}>
        <DialogContent className="max-w-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-2xl">
              <Edit className="w-6 h-6 mr-2 text-indigo-600" />
              Edit Profile
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Full Name
              </Label>
              <Input
                id="name"
                value={user?.full_name || ''}
                className="col-span-3 bg-white/50 dark:bg-slate-700/50"
                onChange={(e) => setUser({...user, full_name: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="institution" className="text-right">
                Institution
              </Label>
              <Input
                id="institution"
                value={user?.institution || ''}
                className="col-span-3 bg-white/50 dark:bg-slate-700/50"
                onChange={(e) => setUser({...user, institution: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Location
              </Label>
              <Input
                id="location"
                value={user?.location || ''}
                className="col-span-3 bg-white/50 dark:bg-slate-700/50"
                onChange={(e) => setUser({...user, location: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-right">
                Bio
              </Label>
              <Textarea
                id="bio"
                value={user?.bio || ''}
                className="col-span-3 bg-white/50 dark:bg-slate-700/50"
                onChange={(e) => setUser({...user, bio: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => setShowEditProfile(false)}>
              Cancel
            </Button>
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}