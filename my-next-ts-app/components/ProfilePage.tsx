'use client';

import { useState, FormEvent, useEffect } from 'react';
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
  BookOpen
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
    { id: 'projects', label: 'Projects / Research', icon: <FolderOpen className="w-4 h-4" /> },
    { id: 'startups', label: 'Startups', icon: <Rocket className="w-4 h-4" /> },
    { id: 'ipr', label: 'IPR Filed', icon: <FileText className="w-4 h-4" /> },
    { id: 'posts', label: 'Posts', icon: <MessageSquare className="w-4 h-4" /> }
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
    if (!currentUserId) {
      // You might want to show an error to the user
      return;
    }
    setIsLoading(true);
    try {
      const newStartupData = await addStartup(newStartup, currentUserId);
      setStartups(prev => [newStartupData, ...prev]);
      setNewStartup({ name: '', idea_summary: '', stage: '', funding_status: '', website: '', pitch_deck_url: '', registered_on: '' });
      setShowAddStartupForm(false);
    } catch (error) {
      // Handle error, maybe show a notification
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
    if (!currentUserId) {
      // You might want to show an error to the user
      return;
    }
    setIsLoading(true);
    try {
      const newPostData = await addPost(newPost, currentUserId);
      setPosts(prev => [newPostData, ...prev]);
      setNewPost({ content: '', media_urls: '', post_type: [], tags: [] });
      setShowAddPostForm(false);
    } catch (error) {
      // Handle error, maybe show a notification
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
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{project.title}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
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
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{project.description}</p>
                  {project.document_url && (
                    <p className="text-sm text-gray-500">
                      Document: <a href={project.document_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Document</a>
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2">
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
                </CardContent>
              </Card>
            ))}
            {showAddProjectForm ? (
              <Card>
                <CardHeader>
                  <CardTitle>Add New Project/Research</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddProject} className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input id="title" placeholder="Title" value={newProject.title} onChange={e => setNewProject({...newProject, title: e.target.value})} required />
                    </div>
                    <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select onValueChange={value => setNewProject({...newProject, category: value})} required>
                            <SelectTrigger id="category"><SelectValue placeholder="Select Category" /></SelectTrigger>
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
                      <Textarea id="description" placeholder="A brief description of your project or research." value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} required />
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input id="tags" placeholder="e.g., AI, Machine Learning, NLP" onChange={e => setNewProject({...newProject, tags: e.target.value.split(',').map(t => t.trim())})} />
                    </div>
                    <div>
                      <Label htmlFor="year">Year of Publishing *</Label>
                      <Input id="year" placeholder="e.g., 2023" value={newProject.yearOfPublishing} onChange={e => setNewProject({...newProject, yearOfPublishing: e.target.value})} required />
                    </div>
                    <div>
                      <Label htmlFor="authors">Authors (comma separated) *</Label>
                      <Input id="authors" placeholder="e.g., John Doe, Jane Smith" onChange={e => setNewProject({...newProject, authors: e.target.value.split(',').map(t => t.trim())})} required />
                    </div>
                    <div>
                      <Label htmlFor="journal">Journal</Label>
                      <Input id="journal" placeholder="e.g., Nature, IEEE" value={newProject.journal || ''} onChange={e => setNewProject({...newProject, journal: e.target.value})} />
                    </div>
                    <div>
                      <Label htmlFor="types">Types (comma separated e.g., Research Paper, High Impact)</Label>
                      <Input id="types" placeholder="e.g., Research Paper, High Impact" onChange={e => setNewProject({...newProject, types: e.target.value.split(',').map(t => t.trim())})} />
                    </div>
                    <div>
                        <Label htmlFor="status">Status *</Label>
                        <Select onValueChange={value => setNewProject({...newProject, status: value})} required>
                            <SelectTrigger id="status"><SelectValue placeholder="Select Status" /></SelectTrigger>
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
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Public">Public</SelectItem>
                                <SelectItem value="Private">Private</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Document URL (Google Drive, etc.)</Label>
                        <input
                            type="url"
                            value={newProject.document_url}
                            onChange={(e) => setNewProject({...newProject, document_url: e.target.value})}
                            placeholder="https://drive.google.com/file/d/..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {fileError && <p className="text-sm text-red-600">{fileError}</p>}
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button type="button" variant="ghost" onClick={() => setShowAddProjectForm(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading}>{isLoading ? 'Adding...' : 'Add Project'}</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card onClick={() => setShowAddProjectForm(true)} className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 transition-colors cursor-pointer">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Plus className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-gray-600 dark:text-gray-300 font-medium">Add Project/Research</p>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'startups':
        return (
          <div className="space-y-6">
            {startups.map((startup) => (
              <Card key={startup.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{startup.name}</CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Registered on {new Date(startup.registered_on).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Trophy className="w-4 h-4 mr-1" />
                          {startup.funding_status}
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(startup.stage)}>
                      {startup.stage}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{startup.idea_summary}</p>
                </CardContent>
              </Card>
            ))}
            {showAddStartupForm ? (
                <Card>
                    <CardHeader><CardTitle>Add New Startup</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddStartup} className="space-y-4">
                            <Input placeholder="Startup Name" value={newStartup.name} onChange={e => setNewStartup({...newStartup, name: e.target.value})} required />
                            <Textarea placeholder="Idea Summary" value={newStartup.idea_summary} onChange={e => setNewStartup({...newStartup, idea_summary: e.target.value})} required />
                            <Input placeholder="Website" value={newStartup.website} onChange={e => setNewStartup({...newStartup, website: e.target.value})} />
                            <Input placeholder="Pitch Deck URL" value={newStartup.pitch_deck_url} onChange={e => setNewStartup({...newStartup, pitch_deck_url: e.target.value})} />
                            <Input type="date" placeholder="Registered On" value={newStartup.registered_on} onChange={e => setNewStartup({...newStartup, registered_on: e.target.value})} required />
                            <Input placeholder="Funding Status" value={newStartup.funding_status} onChange={e => setNewStartup({...newStartup, funding_status: e.target.value})} required />
                            <Select onValueChange={value => setNewStartup({...newStartup, stage: value})} required>
                                <SelectTrigger><SelectValue placeholder="Stage" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Idea">Idea</SelectItem>
                                    <SelectItem value="Prototype">Prototype</SelectItem>
                                    <SelectItem value="MVP">MVP</SelectItem>
                                    <SelectItem value="Seed">Seed</SelectItem>
                                    <SelectItem value="Series A">Series A</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="flex justify-end space-x-2">
                                <Button type="button" variant="ghost" onClick={() => setShowAddStartupForm(false)}>Cancel</Button>
                                <Button type="submit">Add Startup</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            ) : (
                <Card onClick={() => setShowAddStartupForm(true)} className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 transition-colors cursor-pointer">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                        <Plus className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-gray-600 dark:text-gray-300 font-medium">Add Startup</p>
                    </CardContent>
                </Card>
            )}
          </div>
        );

      case 'ipr':
        return (
          <div className="space-y-6">
            {iprs.map((ipr) => (
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
            {showAddIprForm ? (
                <Card>
                    <CardHeader><CardTitle>Add New IPR</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddIpr} className="space-y-4">
                            <Input placeholder="Title" value={newIpr.title} onChange={e => setNewIpr({...newIpr, title: e.target.value})} required />
                            <Input placeholder="Application Number" value={newIpr.applicationNumber} onChange={e => setNewIpr({...newIpr, applicationNumber: e.target.value})} required />
                            <Input type="date" placeholder="Filed Date" value={newIpr.filedDate} onChange={e => setNewIpr({...newIpr, filedDate: e.target.value})} required />
                            <Input type="date" placeholder="Granted Date" value={newIpr.grantedDate || ''} onChange={e => setNewIpr({...newIpr, grantedDate: e.target.value})} />
                             <Select onValueChange={value => setNewIpr({...newIpr, type: value})} required>
                                <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Patent">Patent</SelectItem>
                                    <SelectItem value="Trademark">Trademark</SelectItem>
                                    <SelectItem value="Copyright">Copyright</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select onValueChange={value => setNewIpr({...newIpr, status: value})} required>
                                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Granted">Granted</SelectItem>
                                    <SelectItem value="Under Examination">Under Examination</SelectItem>
                                    <SelectItem value="Registered">Registered</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="flex justify-end space-x-2">
                                <Button type="button" variant="ghost" onClick={() => setShowAddIprForm(false)}>Cancel</Button>
                                <Button type="submit">Add IPR</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            ) : (
                <Card onClick={() => setShowAddIprForm(true)} className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 transition-colors cursor-pointer">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                        <Plus className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-gray-600 dark:text-gray-300 font-medium">Add IPR</p>
                    </CardContent>
                </Card>
            )}
          </div>
        );

      case 'posts':
        return (
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(post.created_at).toLocaleDateString()}
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
                  {post.media_urls && <a href={post.media_urls} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm">View Media</a>}
                </CardContent>
              </Card>
            ))}
            {showAddPostForm ? (
                <Card>
                    <CardHeader><CardTitle>Add New Post</CardTitle></CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddPost} className="space-y-4">
                            <Textarea placeholder="Content" value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})} required />
                            <Input placeholder="Media URL" value={newPost.media_urls} onChange={e => setNewPost({...newPost, media_urls: e.target.value})} />
                            <Input placeholder="Post Type (comma separated)" onChange={e => setNewPost({...newPost, post_type: e.target.value.split(',').map(t => t.trim())})} />
                            <Input placeholder="Tags (comma separated)" onChange={e => setNewPost({...newPost, tags: e.target.value.split(',').map(t => t.trim())})} />
                            <div className="flex justify-end space-x-2">
                                <Button type="button" variant="ghost" onClick={() => setShowAddPostForm(false)}>Cancel</Button>
                                <Button type="submit">Add Post</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            ) : (
                <Card onClick={() => setShowAddPostForm(true)} className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 transition-colors cursor-pointer">
                    <CardContent className="flex flex-col items-center justify-center py-8">
                        <Plus className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-gray-600 dark:text-gray-300 font-medium">Add Post</p>
                    </CardContent>
                </Card>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.full_name}</h1>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">{user?.role}</p>
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
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={user?.full_name || ''} />
                      </div>
                      <div>
                        <Label htmlFor="designation">Designation</Label>
                        <Input id="designation" defaultValue={user?.role || ''} />
                      </div>
                      <div>
                        <Label htmlFor="institution">Institution</Label>
                        <Input id="institution" defaultValue={user?.organization || ''} />
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" placeholder="Tell us about yourself..." />
                      </div>
                      <Button className="w-full">Save Changes</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">{user?.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">{user?.organization}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">Mumbai, India</span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-4">
                {user?.bio}
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
              className={`flex items-center space-x-2 px-4 py-3 font-medium transition-colors ${
                activeTab === tab.id
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