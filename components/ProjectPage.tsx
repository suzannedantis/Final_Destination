import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Adjust the path as needed
import {
  Search, Filter, BookOpen, Users, Calendar, Download,
  ExternalLink, Eye, TrendingUp, Tag, ChevronDown, ChevronUp,
  Moon, Sun, ArrowLeft, RefreshCw, AlertCircle
} from 'lucide-react';

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
  pdf_url: string;
  external_url: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  user_id: string;
  author_name: string;
}

const ResearchPapersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [filteredPapers, setFilteredPapers] = useState<ResearchPaper[]>([]);
  const [allPapers, setAllPapers] = useState<ResearchPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    'all', 'Artificial Intelligence', 'Blockchain', 'IoT', 'Quantum Computing',
    'Biotechnology', 'EdTech', 'Cybersecurity', 'Robotics', 'Data Science'
  ];

  const years = ['all', '2024', '2023', '2022', '2021', '2020'];

  const fetchPapers = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: papers, error } = await supabase
        .from('research_papers')
        .select('*')
        .eq('is_public', true);

      if (error) throw error;

      setAllPapers(papers || []);
    } catch (err) {
      console.error('Error fetching papers:', err);
      setError('Failed to load research papers. Please try again.');

      // fallback data if Supabase fails
      const samplePapers: ResearchPaper[] = [/* ...same fallback sample data as before... */];
      setAllPapers(samplePapers);
    } finally {
      setLoading(false);
    }
  };

  const trackView = async (paperId: number) => {
    try {
      const paper = allPapers.find(p => p.id === paperId);
      if (!paper) return;

      await supabase
        .from('research_papers')
        .update({ views: paper.views + 1 })
        .eq('id', paperId);

      setAllPapers(papers =>
        papers.map(p =>
          p.id === paperId ? { ...p, views: p.views + 1 } : p
        )
      );
    } catch (err) {
      console.error('Error tracking view:', err);
    }
  };

  const trackDownload = async (paperId: number) => {
    try {
      const paper = allPapers.find(p => p.id === paperId);
      if (!paper) return;

      await supabase
        .from('research_papers')
        .update({ downloads: paper.downloads + 1 })
        .eq('id', paperId);

      setAllPapers(papers =>
        papers.map(p =>
          p.id === paperId ? { ...p, downloads: p.downloads + 1 } : p
        )
      );
    } catch (err) {
      console.error('Error tracking download:', err);
    }
  };

  useEffect(() => {
    fetchPapers();
  }, []);

  useEffect(() => {
    filterPapers();
  }, [searchQuery, selectedCategory, selectedYear, sortBy, allPapers]);

  const filterPapers = () => {
    let filtered = allPapers.filter(paper => {
      const matchesSearch =
        paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase())) ||
        paper.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
        paper.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === 'all' || paper.category === selectedCategory;
      const matchesYear = selectedYear === 'all' || paper.year.toString() === selectedYear;

      return matchesSearch && matchesCategory && matchesYear;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'citations': return b.citations - a.citations;
        case 'views': return b.views - a.views;
        case 'year': return b.year - a.year;
        case 'title': return a.title.localeCompare(b.title);
        case 'recent': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default: return b.citations - a.citations; // relevance fallback
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
      case 'Draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const toggleTheme = () => setDarkMode(!darkMode);

  const handlePaperClick = (paperId: number) => trackView(paperId);

  const handleDownload = (paperId: number, url: string) => {
    trackDownload(paperId);
    if (url && url !== '#') window.open(url, '_blank');
  };

  const handleExternalLink = (paperId: number, url: string) => {
    trackView(paperId);
    if (url && url !== '#') window.open(url, '_blank');
  };

  // ... Keep rest of your JSX render return here (header, filters, search, list of papers etc.) unchanged ...

  return (
    <>
      {/* Same JSX content as before (the return block) */}
    </>
  );
};

export default ResearchPapersPage;
