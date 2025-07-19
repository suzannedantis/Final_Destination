'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Plus, 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Edit,
  Trash2,
  FlaskConical,
  Target,
  BookOpen,
  GitBranch,
  Award,
  ExternalLink
} from 'lucide-react';

export default function ProjectPage() {
  const [showAddProject, setShowAddProject] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: '',
    status: '',
    description: '',
    category: '',
    startDate: '',
    endDate: '',
    collaborators: '',
    funding: '',
    institution: '',
    supervisor: '',
    tags: [],
    progress: 0
  });

  const mockProjects = [
    {
      id: 1,
      title: 'AI-Powered Smart Agriculture System',
      status: 'In Progress',
      category: 'Research',
      description: 'Developing machine learning algorithms for crop yield prediction and pest detection using IoT sensors and drone imagery. The system aims to optimize agricultural productivity while reducing environmental impact.',
      startDate: '2024-01-15',
      endDate: '2024-12-15',
      collaborators: 5,
      funding: '$50,000',
      institution: 'IIT Mumbai',
      supervisor: 'Dr. Rajesh Kumar',
      tags: ['AI', 'IoT', 'Agriculture', 'Machine Learning', 'Sustainability'],
      progress: 75,
      publications: 2,
      patents: 1
    },
    {
      id: 2,
      title: 'Sustainable Energy Storage Solutions',
      status: 'Completed',
      category: 'Research',
      description: 'Research on advanced battery technologies using eco-friendly materials for renewable energy storage. Successfully developed a prototype with 30% improved efficiency.',
      startDate: '2023-08-01',
      endDate: '2024-02-28',
      collaborators: 8,
      funding: '$75,000',
      institution: 'IIT Delhi',
      supervisor: 'Dr. Priya Sharma',
      tags: ['Battery Tech', 'Renewable Energy', 'Materials Science', 'Sustainability'],
      progress: 100,
      publications: 3,
      patents: 2
    },
    {
      id: 3,
      title: 'Blockchain-Based Supply Chain Management',
      status: 'Planning',
      category: 'Project',
      description: 'Designing a transparent and secure supply chain management system using blockchain technology to ensure product authenticity and traceability.',
      startDate: '2024-03-01',
      endDate: '2024-11-30',
      collaborators: 3,
      funding: '$25,000',
      institution: 'IIT Bombay',
      supervisor: 'Prof. Amit Patel',
      tags: ['Blockchain', 'Supply Chain', 'Security', 'Transparency'],
      progress: 20,
      publications: 0,
      patents: 0
    },
    {
      id: 4,
      title: 'Mental Health Monitoring App',
      status: 'In Progress',
      category: 'Project',
      description: 'Mobile application for continuous mental health monitoring using sentiment analysis and behavioral pattern recognition to provide early intervention support.',
      startDate: '2023-11-10',
      endDate: '2024-06-30',
      collaborators: 4,
      funding: '$30,000',
      institution: 'AIIMS Delhi',
      supervisor: 'Dr. Meera Joshi',
      tags: ['Mental Health', 'Mobile App', 'AI', 'Healthcare', 'Sentiment Analysis'],
      progress: 60,
      publications: 1,
      patents: 0
    }
  ];

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Planning': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'On Hold': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'Cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  const getStatusIcon = (status: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      'Planning': <AlertCircle className="w-4 h-4" />,
      'In Progress': <Clock className="w-4 h-4" />,
      'Completed': <CheckCircle className="w-4 h-4" />,
      'On Hold': <AlertCircle className="w-4 h-4" />,
      'Cancelled': <AlertCircle className="w-4 h-4" />
    };
    return icons[status] || <Clock className="w-4 h-4" />;
  };

  const getCategoryIcon = (category: string) => {
    return category === 'Research' ? <FlaskConical className="w-5 h-5" /> : <Target className="w-5 h-5" />;
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Adding project:', projectForm);
    setShowAddProject(false);
    // Reset form
    setProjectForm({
      title: '',
      status: '',
      description: '',
      category: '',
      startDate: '',
      endDate: '',
      collaborators: '',
      funding: '',
      institution: '',
      supervisor: '',
      tags: [],
      progress: 0
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Projects & Research</h1>
        <p className="text-gray-600 dark:text-gray-300">Track your research projects, academic work, and innovation initiatives</p>
      </div>

      {/* Projects Grid */}
      <div className="grid gap-6">
        {mockProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-500">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
                    {getCategoryIcon(project.category)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {project.category}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {project.collaborators} collaborators
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {project.institution}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <Target className="w-4 h-4 mr-1" />
                        Supervisor: {project.supervisor}
                      </div>
                      <div className="flex items-center">
                        <Award className="w-4 h-4 mr-1" />
                        {project.publications} publications, {project.patents} patents
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(project.status)}
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{project.description}</p>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Additional Info */}
              <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center space-x-4">
                  <span>Funding: {project.funding}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add Project Card */}
        <Dialog open={showAddProject} onOpenChange={setShowAddProject}>
          <DialogTrigger asChild>
            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Add Project / Research</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  Document your research projects, academic work, or innovation initiatives
                </p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <FlaskConical className="w-5 h-5" />
                <span>Add New Project / Research</span>
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddProject} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="project-title">Project Title *</Label>
                  <Input
                    id="project-title"
                    placeholder="Enter project title"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({...projectForm, title: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="project-category">Category *</Label>
                  <Select value={projectForm.category} onValueChange={(value) => setProjectForm({...projectForm, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Research">Research</SelectItem>
                      <SelectItem value="Project">Project</SelectItem>
                      <SelectItem value="Thesis">Thesis</SelectItem>
                      <SelectItem value="Innovation">Innovation</SelectItem>
                      <SelectItem value="Consultancy">Consultancy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="project-status">Status *</Label>
                  <Select value={projectForm.status} onValueChange={(value) => setProjectForm({...projectForm, status: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="project-progress">Progress (%)</Label>
                  <Input
                    id="project-progress"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0-100"
                    value={projectForm.progress}
                    onChange={(e) => setProjectForm({...projectForm, progress: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="project-description">Description *</Label>
                <Textarea
                  id="project-description"
                  placeholder="Describe your project, its objectives, methodology, and expected outcomes..."
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="project-start-date">Start Date</Label>
                  <Input
                    id="project-start-date"
                    type="date"
                    value={projectForm.startDate}
                    onChange={(e) => setProjectForm({...projectForm, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="project-end-date">End Date</Label>
                  <Input
                    id="project-end-date"
                    type="date"
                    value={projectForm.endDate}
                    onChange={(e) => setProjectForm({...projectForm, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="project-institution">Institution</Label>
                  <Input
                    id="project-institution"
                    placeholder="Your institution or organization"
                    value={projectForm.institution}
                    onChange={(e) => setProjectForm({...projectForm, institution: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="project-supervisor">Supervisor/Mentor</Label>
                  <Input
                    id="project-supervisor"
                    placeholder="Project supervisor or mentor"
                    value={projectForm.supervisor}
                    onChange={(e) => setProjectForm({...projectForm, supervisor: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="project-collaborators">Number of Collaborators</Label>
                  <Input
                    id="project-collaborators"
                    type="number"
                    placeholder="Number of team members"
                    value={projectForm.collaborators}
                    onChange={(e) => setProjectForm({...projectForm, collaborators: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="project-funding">Funding Amount</Label>
                  <Input
                    id="project-funding"
                    placeholder="e.g., $10,000, ₹5,00,000, Grant funded"
                    value={projectForm.funding}
                    onChange={(e) => setProjectForm({...projectForm, funding: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setShowAddProject(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add Project
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Empty State */}
      {mockProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <FlaskConical className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No projects yet</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Start documenting your research and project work
          </p>
          <Button onClick={() => setShowAddProject(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Project
          </Button>
        </div>
      )}
    </div>
  );
}