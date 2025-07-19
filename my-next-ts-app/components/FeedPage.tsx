'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Eye, MapPin, Users, Calendar } from 'lucide-react';

interface StartupPost {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo: string;
  status: string;
  tags: string[];
  fundingStage: string;
  iprFiled: boolean;
  location: string;
  teamSize: number;
  founded: string;
  founder: string;
}

export default function FeedPage() {
  const [posts, setPosts] = useState<StartupPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [fundingFilter, setFundingFilter] = useState('all');
  const [iprFilter, setIprFilter] = useState('all');
  const [filteredPosts, setFilteredPosts] = useState<StartupPost[]>([]);

  useEffect(() => {
    const mockPosts: StartupPost[] = [
      {
        id: '1',
        name: 'EcoTech Solutions',
        tagline: 'Sustainable technology for a greener future',
        description: 'Developing IoT-based smart waste management systems for urban environments',
        logo: '🌱',
        status: 'MVP Ready',
        tags: ['#Startup', '#Innovation', '#GreenTech'],
        fundingStage: 'Pre-Seed',
        iprFiled: true,
        location: 'Bangalore, India',
        teamSize: 8,
        founded: '2024',
        founder: 'Sarah Chen'
      },
      {
        id: '2',
        name: 'HealthAI Labs',
        tagline: 'AI-powered healthcare diagnostics',
        description: 'Revolutionary machine learning platform for early disease detection',
        logo: '🏥',
        status: 'Seed Funded',
        tags: ['#Research', '#AI', '#Healthcare'],
        fundingStage: 'Seed',
        iprFiled: true,
        location: 'Mumbai, India',
        teamSize: 12,
        founded: '2023',
        founder: 'Dr. Rajesh Kumar'
      },
      {
        id: '3',
        name: 'EdTech Innovations',
        tagline: 'Transforming education through technology',
        description: 'Virtual reality platform for immersive learning experiences',
        logo: '📚',
        status: 'Prototype',
        tags: ['#Startup', '#EdTech', '#VR'],
        fundingStage: 'Ideation',
        iprFiled: false,
        location: 'Delhi, India',
        teamSize: 5,
        founded: '2024',
        founder: 'Priya Sharma'
      },
      {
        id: '4',
        name: 'FinTech Pro',
        tagline: 'Next-gen financial solutions',
        description: 'Blockchain-based payment processing for small businesses',
        logo: '💰',
        status: 'Series A',
        tags: ['#FinTech', '#Blockchain', '#Innovation'],
        fundingStage: 'Series A',
        iprFiled: true,
        location: 'Hyderabad, India',
        teamSize: 25,
        founded: '2022',
        founder: 'Amit Patel'
      },
      {
        id: '5',
        name: 'BioInnovate',
        tagline: 'Biotechnology for better health',
        description: 'Developing novel drug delivery systems using nanotechnology',
        logo: '🔬',
        status: 'Research Phase',
        tags: ['#Research', '#Biotech', '#IPR'],
        fundingStage: 'Grant Funded',
        iprFiled: true,
        location: 'Pune, India',
        teamSize: 15,
        founded: '2023',
        founder: 'Dr. Meera Joshi'
      },
      {
        id: '6',
        name: 'AgriTech Vision',
        tagline: 'Smart farming for sustainable agriculture',
        description: 'Precision agriculture platform using drones and IoT sensors',
        logo: '🌾',
        status: 'Beta Testing',
        tags: ['#AgriTech', '#IoT', '#Startup'],
        fundingStage: 'Pre-Seed',
        iprFiled: false,
        location: 'Chennai, India',
        teamSize: 10,
        founded: '2024',
        founder: 'Vikram Singh'
      }
    ];

    setPosts(mockPosts);
    setFilteredPosts(mockPosts);
  }, []);

  useEffect(() => {
    let filtered = posts;
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (fundingFilter !== 'all') {
      filtered = filtered.filter(post => post.fundingStage === fundingFilter);
    }
    if (iprFilter !== 'all') {
      filtered = filtered.filter(post => iprFilter === 'yes' ? post.iprFiled : !post.iprFiled);
    }
    setFilteredPosts(filtered);
  }, [searchTerm, fundingFilter, iprFilter, posts]);

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'MVP Ready': 'bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-300',
      'Seed Funded': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
      'Prototype': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
      'Series A': 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
      'Research Phase': 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300',
      'Beta Testing': 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 bg-gradient-to-br from-green-50 to-cyan-100 dark:from-[#0f172a] dark:to-[#1e293b] rounded-xl shadow-lg">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Bringing Innovation Into Life</h1>
        <p className="text-md text-gray-700 dark:text-gray-300 mt-2">Explore revolutionary ideas, startups, and research transforming tomorrow.</p>
      </div>

      <div className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search startups, projects, or innovations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-slate-800 rounded-full shadow-sm"
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Filter className="w-4 h-4" />
            <span>Filters:</span>
          </div>

          <Select value={fundingFilter} onValueChange={setFundingFilter}>
            <SelectTrigger className="w-[180px] rounded-full">
              <SelectValue placeholder="Funding Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              <SelectItem value="Ideation">Ideation</SelectItem>
              <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
              <SelectItem value="Seed">Seed</SelectItem>
              <SelectItem value="Series A">Series A</SelectItem>
              <SelectItem value="Grant Funded">Grant Funded</SelectItem>
            </SelectContent>
          </Select>

          <Select value={iprFilter} onValueChange={setIprFilter}>
            <SelectTrigger className="w-[150px] rounded-full">
              <SelectValue placeholder="IPR Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All IPR</SelectItem>
              <SelectItem value="yes">IPR Filed</SelectItem>
              <SelectItem value="no">No IPR</SelectItem>
            </SelectContent>
          </Select>

          {(fundingFilter !== 'all' || iprFilter !== 'all') && (
            <div className="flex flex-wrap gap-2">
              {fundingFilter !== 'all' && (
                <Badge variant="outline" className="cursor-pointer" onClick={() => setFundingFilter('all')}>
                  {fundingFilter} <span className="ml-1 text-red-500">✕</span>
                </Badge>
              )}
              {iprFilter !== 'all' && (
                <Badge variant="outline" className="cursor-pointer" onClick={() => setIprFilter('all')}>
                  {iprFilter === 'yes' ? 'IPR Filed' : 'No IPR'} <span className="ml-1 text-red-500">✕</span>
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {filteredPosts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <Card className="hover:shadow-xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border-2 border-transparent hover:border-cyan-300 dark:hover:border-lime-400 transition duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl shadow-lg bg-gradient-to-br from-lime-400 to-cyan-500 text-white">
                      {post.logo}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{post.name}</h3>
                      <p className="text-gray-600 dark:text-gray-400 font-medium">{post.tagline}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {post.location}
                        </span>
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {post.teamSize} members
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Founded {post.founded}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getStatusColor(post.status)}>{post.status}</Badge>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{post.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Founder: {post.founder}</span>
                    <span>•</span>
                    <span>{post.fundingStage}</span>
                    <span>•</span>
                    <span className={`font-medium ${post.iprFiled ? 'text-emerald-600' : 'text-red-500'}`}>
                      {post.iprFiled ? 'IPR Filed' : 'No IPR'}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2 hover:bg-cyan-100 dark:hover:bg-lime-900 transition-colors">
                    <Eye className="w-4 h-4" />
                    <span>View Profile</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No results found</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Try adjusting your search or filters</p>
          <Button variant="default" onClick={() => {
            setSearchTerm('');
            setFundingFilter('all');
            setIprFilter('all');
          }}>
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
