'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAllProjects } from '@/lib/projectService';
import ReactMarkdown from 'react-markdown';
import {
  Calendar,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  BookOpen,
  Trophy,
  Sparkles,
  Loader2
} from 'lucide-react';

// Data interface matching ProfilePage
interface Project {
  name: any;
  id: number;
  title: string;
  abstract: string;
  category: string;
  tags: string[];
  year: string;
  authors: string[];
  journal?: string;
  types: string;
  status: string;
  is_public: boolean;
  pdf_url?: string;
  author_name: string;
}

export default function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [summarizingProject, setSummarizingProject] = useState<number | null>(null);
  const [projectSummaries, setProjectSummaries] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const allProjects = await getAllProjects();
        setProjects(allProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'In Progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Planning': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
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
      'On Hold': <AlertCircle className="w-4 h-4" />,
      'Cancelled': <AlertCircle className="w-4 h-4" />
    };
    return icons[status] || <AlertCircle className="w-4 h-4" />;
  };

  const handleSummarizeProject = async (project: Project) => {
  setSummarizingProject(project.id);
  
  try {
    // Debug: Log what we're sending
    console.log('Project being summarized:', project);
    
    // Your API route expects the entire project object
    const requestBody = { project };

    // Debug: Log the request body
    console.log('Request body being sent:', requestBody);

    // Basic validation - ensure project has required fields
    if (!project.title || !project.abstract) {
      throw new Error('Project is missing required information (title or abstract)');
    }

    const response = await fetch('/api/summarize-project', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle specific error messages from the API
      const errorMessage = data.error || `HTTP ${response.status}: Failed to summarize project`;
      throw new Error(errorMessage);
    }

    // Ensure we have a summary in the response
    if (!data.summary) {
      throw new Error('No summary received from API');
    }

    setProjectSummaries(prev => ({
      ...prev,
      [project.id]: data.summary
    }));

    // Optional: Show success message
    console.log(`Successfully generated summary for project: ${project.name}`);

  } catch (error) {
    console.error('Error summarizing project:', error);
    
    // More specific error handling
    let errorMessage = 'Failed to summarize project. Please try again.';
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = 'API configuration error. Please contact support.';
      } else if (error.message.includes('quota')) {
        errorMessage = 'Service temporarily unavailable. Please try again later.';
      } else if (error.message.includes('required information')) {
        errorMessage = error.message; // Use the specific validation error
      }
    }
    
    alert(errorMessage);
    
    // Optional: You might want to use a proper toast notification instead of alert
    // toast.error(errorMessage);
    
  } finally {
    setSummarizingProject(null);
  }
};

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Projects & Research</h1>
          <p className="text-gray-600 dark:text-gray-300">Explore research projects and academic work from the community</p>
        </div>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-300">Loading projects...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Projects & Research</h1>
        <p className="text-gray-600 dark:text-gray-300">Explore research projects and academic work from the community</p>
      </div>

      {/* Projects List */}
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
                      Published in {project.year}
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
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mt-1">
                    <div className="flex items-center">
                      <Trophy className="w-4 h-4 mr-1" />
                      By {project.author_name}
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
              <p className="text-gray-700 dark:text-gray-300 mb-4">{project.abstract}</p>
              
              {project.pdf_url && (
                <p className="text-sm text-gray-500 mb-4">
                  Document: <a href={project.pdf_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Document</a>
                </p>
              )}

              <div className="flex flex-wrap gap-2 mb-4">
                {project.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {project.types && project.types.split(',').map((type, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {type.trim()}
                  </Badge>
                ))}
              </div>

              {/* Summarize Button */}
              <div className="flex justify-between items-center">
                <Badge variant="outline" className="text-xs">
                  {project.category}
                </Badge>
                <Button
                  onClick={() => handleSummarizeProject(project)}
                  disabled={summarizingProject === project.id}
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                >
                  {summarizingProject === project.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Summarizing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Summarize Project
                    </>
                  )}
                </Button>
              </div>

              {/* AI Summary */}
              {projectSummaries[project.id] && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="text-sm text-blue-800 dark:text-blue-200 whitespace-pre-wrap">
                    <ReactMarkdown>{projectSummaries[project.id]}</ReactMarkdown>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No projects available</h3>
          <p className="text-gray-600 dark:text-gray-300">
            No public research projects or papers have been shared yet.
          </p>
        </div>
      )}
    </div>
  );
}