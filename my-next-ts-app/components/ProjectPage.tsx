import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, Users, Calendar, Download, ExternalLink, Eye, TrendingUp, Tag, ChevronDown, ChevronUp, Moon, Sun, ArrowLeft } from 'lucide-react';

interface ResearchPaper {
  id: number;
  title: string;
  authors: string[];
  abstract: string;
  category: string;
  year: number;
  journal: string;
  citations: number;
  views: number;
  downloads: number;
  tags: string[];
  type: string;
  status: string;
  impact: string;
  pdfUrl: string;
  externalUrl: string;
}

const ResearchPapersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [filteredPapers, setFilteredPapers] = useState<ResearchPaper[]>([]);

  // Sample research papers data
  const researchPapers: ResearchPaper[] = [
    {
      id: 1,
      title: "Advancing Artificial Intelligence in Healthcare: A Comprehensive Review of Machine Learning Applications",
      authors: ["Dr. Sarah Chen", "Prof. Michael Rodriguez", "Dr. Priya Patel"],
      abstract: "This paper explores the transformative potential of artificial intelligence in healthcare, focusing on machine learning applications that are revolutionizing diagnosis, treatment planning, and patient care. We present a comprehensive analysis of current AI implementations across various medical domains.",
      category: "Artificial Intelligence",
      year: 2024,
      journal: "Journal of Medical AI",
      citations: 127,
      views: 1543,
      downloads: 892,
      tags: ["AI", "Healthcare", "Machine Learning", "Medical Diagnosis"],
      type: "Research Paper",
      status: "Published",
      impact: "High",
      pdfUrl: "#",
      externalUrl: "#"
    },
    {
      id: 2,
      title: "Blockchain Technology for Secure Financial Transactions: Implementation and Performance Analysis",
      authors: ["Dr. James Wilson", "Prof. Lisa Zhang", "Alex Thompson"],
      abstract: "An in-depth analysis of blockchain technology applications in financial services, examining security protocols, transaction efficiency, and scalability challenges. This study provides practical insights for fintech implementation.",
      category: "Blockchain",
      year: 2024,
      journal: "FinTech Research Quarterly",
      citations: 89,
      views: 2156,
      downloads: 1234,
      tags: ["Blockchain", "FinTech", "Security", "Cryptocurrency"],
      type: "Research Paper",
      status: "Published",
      impact: "High",
      pdfUrl: "#",
      externalUrl: "#"
    },
    {
      id: 3,
      title: "Sustainable Energy Solutions: IoT-Enabled Smart Grid Management",
      authors: ["Dr. Elena Rodriguez", "Prof. David Kim", "Maria Santos"],
      abstract: "This research investigates the integration of Internet of Things (IoT) technologies in smart grid systems to optimize energy distribution and reduce carbon footprint. We present novel algorithms for real-time energy management.",
      category: "IoT",
      year: 2023,
      journal: "Sustainable Technology Review",
      citations: 156,
      views: 1876,
      downloads: 967,
      tags: ["IoT", "Smart Grid", "Sustainability", "Energy Management"],
      type: "Research Paper",
      status: "Published",
      impact: "Medium",
      pdfUrl: "#",
      externalUrl: "#"
    },
    {
      id: 4,
      title: "Quantum Computing Applications in Cryptography: Future Implications",
      authors: ["Prof. Robert Chen", "Dr. Amanda Foster"],
      abstract: "An exploration of quantum computing's impact on modern cryptography, analyzing potential vulnerabilities and proposing quantum-resistant encryption methods for future digital security.",
      category: "Quantum Computing",
      year: 2024,
      journal: "Quantum Research Letters",
      citations: 73,
      views: 1287,
      downloads: 645,
      tags: ["Quantum Computing", "Cryptography", "Security", "Encryption"],
      type: "Research Paper",
      status: "Published",
      impact: "High",
      pdfUrl: "#",
      externalUrl: "#"
    },
    {
      id: 5,
      title: "Biotechnology Innovations in Drug Discovery: AI-Powered Molecular Design",
      authors: ["Dr. Jennifer Wang", "Prof. Mark Thompson", "Dr. Rahul Sharma"],
      abstract: "This study examines the role of artificial intelligence in accelerating drug discovery processes, focusing on molecular design and predictive modeling for pharmaceutical development.",
      category: "Biotechnology",
      year: 2023,
      journal: "Biotech Innovation Today",
      citations: 198,
      views: 2341,
      downloads: 1456,
      tags: ["Biotechnology", "Drug Discovery", "AI", "Molecular Design"],
      type: "Research Paper",
      status: "Published",
      impact: "High",
      pdfUrl: "#",
      externalUrl: "#"
    },
    {
      id: 6,
      title: "EdTech Revolution: Personalized Learning through Data Analytics",
      authors: ["Dr. Sophie Miller", "Prof. Carlos Rodriguez"],
      abstract: "An investigation into how educational technology is transforming learning experiences through personalized approaches, leveraging data analytics to improve student outcomes and engagement.",
      category: "EdTech",
      year: 2024,
      journal: "Educational Technology Research",
      citations: 67,
      views: 1432,
      downloads: 789,
      tags: ["EdTech", "Personalized Learning", "Data Analytics", "Education"],
      type: "Research Project",
      status: "Ongoing",
      impact: "Medium",
      pdfUrl: "#",
      externalUrl: "#"
    }
  ];

  const categories = [
    'all', 'Artificial Intelligence', 'Blockchain', 'IoT', 'Quantum Computing', 
    'Biotechnology', 'EdTech', 'Cybersecurity', 'Robotics', 'Data Science'
  ];

  const years = ['all', '2024', '2023', '2022', '2021', '2020'];

  useEffect(() => {
    filterPapers();
  }, [searchQuery, selectedCategory, selectedYear, sortBy]);

  const filterPapers = () => {
    let filtered = researchPapers.filter(paper => {
      const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          paper.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          paper.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || paper.category === selectedCategory;
      const matchesYear = selectedYear === 'all' || paper.year.toString() === selectedYear;
      
      return matchesSearch && matchesCategory && matchesYear;
    });

    // Sort papers
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'citations':
          return b.citations - a.citations;
        case 'views':
          return b.views - a.views;
        case 'year':
          return b.year - a.year;
        case 'title':
          return a.title.localeCompare(b.title);
        default: // relevance
          return b.citations - a.citations;
      }
    });

    setFilteredPapers(filtered);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'Ongoing': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        {/* Header */}
        <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Research Papers & Projects</h1>
              </div>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </header>

        {/* Search and Filters */}
        <div className="container mx-auto px-4 py-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            {/* Search Bar */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search papers, authors, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {filteredPapers.length} papers found
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    {years.map(year => (
                      <option key={year} value={year}>
                        {year === 'all' ? 'All Years' : year}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="citations">Citations</option>
                    <option value="views">Views</option>
                    <option value="year">Year</option>
                    <option value="title">Title</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedYear('all');
                      setSortBy('relevance');
                    }}
                    className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Research Papers List */}
          <div className="space-y-6">
            {filteredPapers.map((paper) => (
              <div
                key={paper.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  {/* Paper Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer transition-colors">
                        {paper.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{paper.authors.join(', ')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{paper.year}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{paper.journal}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status and Impact Badges */}
                  <div className="flex items-center space-x-2 mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(paper.status)}`}>
                      {paper.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getImpactColor(paper.impact)}`}>
                      {paper.impact} Impact
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                      {paper.type}
                    </span>
                  </div>

                  {/* Abstract */}
                  <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                    {paper.abstract}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {paper.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md text-xs font-medium"
                      >
                        <Tag className="h-3 w-3 inline mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats and Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>{paper.citations} citations</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-4 w-4" />
                        <span>{paper.views.toLocaleString()} views</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="h-4 w-4" />
                        <span>{paper.downloads.toLocaleString()} downloads</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-sm">
                        <Download className="h-4 w-4" />
                        <span>PDF</span>
                      </button>
                      <button className="flex items-center space-x-1 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm">
                        <ExternalLink className="h-4 w-4" />
                        <span>View</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredPapers.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No papers found</h3>
              <p className="text-gray-600 dark:text-gray-400">Try adjusting your search terms or filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResearchPapersPage;