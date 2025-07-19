'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  Loader2,
  Target,
  Lightbulb,
  TrendingUp,
  FileText,
  Search
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

interface ResearchSearchResult {
  title: string;
  authors: string[];
  year: string;
  journal?: string;
  abstract: string;
  tags: string[];
  type: string;
  status: string;
  relevanceScore: number;
  keyFindings: string;
}

export default function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [summarizingProject, setSummarizingProject] = useState<number | null>(null);
  const [projectSummaries, setProjectSummaries] = useState<{ [key: number]: string }>({});
  
  // Search functionality state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ResearchSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [summarizingFindings, setSummarizingFindings] = useState(false);
  const [findingsSummary, setFindingsSummary] = useState<string>('');
  const [summarizingPaper, setSummarizingPaper] = useState<number | null>(null);
  const [paperSummaries, setPaperSummaries] = useState<{ [key: number]: string }>({});

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

  // Custom component to render AI summary in a professional format
  const ProjectSummaryDisplay = ({ summary }: { summary: string }) => {
    // Parse the markdown-like content into structured sections
    const parseContent = (text: string) => {
      const sections: Array<{ title: string; content: string[]; icon: any }> = [];
      const lines = text.split('\n').filter(line => line.trim());
      
      let currentSection: { title: string; content: string[]; icon: any } = { title: '', content: [], icon: FileText };
      
      for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Check for section headers (bold text or numbered items)
        if (trimmedLine.match(/^\*\*.*\*\*$/) || trimmedLine.match(/^\d+\.\s*\*\*.*\*\*/) || trimmedLine.match(/^#+\s/)) {
          // Save previous section if it has content
          if (currentSection.title && currentSection.content.length > 0) {
            sections.push({ ...currentSection });
          }
          
          // Start new section
          const title = trimmedLine
            .replace(/^\*\*|\*\*$/g, '')
            .replace(/^\d+\.\s*/, '')
            .replace(/^#+\s*/, '')
            .trim();
          
          // Assign icons based on content
          let icon = FileText;
          if (title.toLowerCase().includes('executive') || title.toLowerCase().includes('summary')) {
            icon = FileText;
          } else if (title.toLowerCase().includes('objective') || title.toLowerCase().includes('methodology')) {
            icon = Target;
          } else if (title.toLowerCase().includes('finding') || title.toLowerCase().includes('outcome')) {
            icon = TrendingUp;
          } else if (title.toLowerCase().includes('significance') || title.toLowerCase().includes('impact')) {
            icon = Lightbulb;
          } else if (title.toLowerCase().includes('recommendation')) {
            icon = CheckCircle;
          }
          
          currentSection = { title, content: [], icon };
        } else if (trimmedLine) {
          // Add content to current section
          const cleanContent = trimmedLine.replace(/^[-*]\s*/, '').trim();
          if (cleanContent) {
            currentSection.content.push(cleanContent);
          }
        }
      }
      
      // Add the last section
      if (currentSection.title && currentSection.content.length > 0) {
        sections.push(currentSection);
      }
      
      // If no structured sections found, create a general summary
      if (sections.length === 0) {
        sections.push({
          title: 'Project Analysis',
          content: text.split('\n').filter(line => line.trim()),
          icon: FileText
        });
      }
      
      return sections;
    };

    const sections = parseContent(summary);

    return (
      <div className="mt-4 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl border border-slate-200 dark:border-gray-700 overflow-hidden">
        {/* Header */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-4 border-b border-slate-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Project Analysis</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">AI-powered research insights</p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="p-6 space-y-6">
          {sections.map((section, index) => (
            <div key={index} className="group">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 group-hover:shadow-md transition-shadow">
                  <section.icon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide">
                    {section.title}
                  </h4>
                  <div className="space-y-2">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {index < sections.length - 1 && (
                <div className="mt-6 border-b border-gray-200 dark:border-gray-600"></div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Analysis generated using advanced AI • {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    );
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

  // Research search functionality
  const handleResearchSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowSearchResults(true);
    setFindingsSummary(''); // Clear previous findings summary

    try {
      const response = await fetch('/api/research-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setSearchResults(data.papers || []);
      } else {
        console.error('Research search failed:', data.message);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching research papers:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleResearchSearch();
    }
  };

  // Summarize findings from search results
  const handleSummarizeFindings = async () => {
    if (searchResults.length === 0) return;

    setSummarizingFindings(true);

    try {
      // Prepare data for summarization
      const findingsData = searchResults.map(paper => ({
        title: paper.title,
        authors: paper.authors,
        year: paper.year,
        keyFindings: paper.keyFindings,
        relevanceScore: paper.relevanceScore
      }));

      const response = await fetch('/api/summarize-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project: {
            title: `Research Findings Summary for: ${searchQuery}`,
            abstract: `Comprehensive analysis of ${searchResults.length} research papers related to ${searchQuery}`,
            findings: findingsData,
            searchQuery: searchQuery
          }
        }),
      });

      const data = await response.json();

      if (response.ok && data.summary) {
        setFindingsSummary(data.summary);
      } else {
        throw new Error(data.error || 'Failed to summarize findings');
      }
    } catch (error) {
      console.error('Error summarizing findings:', error);
      alert('Failed to summarize research findings. Please try again.');
    } finally {
      setSummarizingFindings(false);
    }
  };

  // Summarize individual research paper
  const handleSummarizePaper = async (paper: ResearchSearchResult, index: number) => {
    setSummarizingPaper(index);

    try {
      const response = await fetch('/api/summarize-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project: {
            title: paper.title,
            abstract: paper.abstract,
            authors: paper.authors,
            year: paper.year,
            journal: paper.journal,
            tags: paper.tags,
            types: paper.type,
            status: paper.status,
            keyFindings: paper.keyFindings,
            category: 'Research Paper'
          }
        }),
      });

      const data = await response.json();

      if (response.ok && data.summary) {
        setPaperSummaries(prev => ({
          ...prev,
          [index]: data.summary
        }));
      } else {
        throw new Error(data.error || 'Failed to summarize paper');
      }
    } catch (error) {
      console.error('Error summarizing paper:', error);
      alert('Failed to summarize research paper. Please try again.');
    } finally {
      setSummarizingPaper(null);
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

      {/* Research Search Section */}
      <div className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Research Paper Search</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Search for academic papers and research projects related to your interests</p>
          
          <div className="flex space-x-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter research topics, keywords, or specific areas of interest..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="w-full"
              />
            </div>
            <Button
              onClick={handleResearchSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="flex items-center space-x-2"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>{isSearching ? 'Searching...' : 'Search Research'}</span>
            </Button>
          </div>
        </div>

        {/* Search Results */}
        {showSearchResults && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Search Results for "{searchQuery}"
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    Found {searchResults.length} related research papers
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {searchResults.length > 0 && (
                    <Button
                      onClick={handleSummarizeFindings}
                      disabled={summarizingFindings}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      {summarizingFindings ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Summarizing...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>Summarize Findings</span>
                        </>
                      )}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSearchResults(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    ×
                  </Button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <span className="text-gray-600 dark:text-gray-300">Searching research papers...</span>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-300">No research papers found for your search query.</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Try different keywords or broader terms.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {searchResults.map((paper, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            {paper.title}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
                            <span>Authors: {paper.authors.join(', ')}</span>
                            <span>Year: {paper.year}</span>
                            {paper.journal && <span>Published in: {paper.journal}</span>}
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {paper.type}
                            </Badge>
                            <Badge className={`text-xs ${
                              paper.status === 'Published'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : paper.status === 'In Review'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            }`}>
                              {paper.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            Relevance: {paper.relevanceScore}/10
                          </div>
                          <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-1">
                            <div
                              className={`h-2 rounded-full ${
                                paper.relevanceScore >= 8
                                  ? 'bg-green-500'
                                  : paper.relevanceScore >= 6
                                  ? 'bg-yellow-500'
                                  : 'bg-blue-500'
                              }`}
                              style={{ width: `${paper.relevanceScore * 10}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 mb-3 text-sm">
                        {paper.abstract}
                      </p>

                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Key Findings:</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {paper.keyFindings}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {paper.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Individual Summarize Button */}
                      <div className="flex justify-end">
                        <Button
                          onClick={() => handleSummarizePaper(paper, index)}
                          disabled={summarizingPaper === index}
                          variant="outline"
                          size="sm"
                          className="flex items-center space-x-2"
                        >
                          {summarizingPaper === index ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Summarizing...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              <span>Summarize Paper</span>
                            </>
                          )}
                        </Button>
                      </div>

                      {/* Individual Paper Summary */}
                      {paperSummaries[index] && (
                        <div className="mt-4">
                          <ProjectSummaryDisplay summary={paperSummaries[index]} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Findings Summary */}
              {findingsSummary && (
                <div className="mt-6">
                  <ProjectSummaryDisplay summary={findingsSummary} />
                </div>
              )}
            </div>
          </div>
        )}
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
                <ProjectSummaryDisplay summary={projectSummaries[project.id]} />
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