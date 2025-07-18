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
import { 
  Plus, 
  Calendar, 
  Users, 
  TrendingUp, 
  Building, 
  MapPin,
  ExternalLink,
  Edit,
  Trash2,
  Rocket,
  Target,
  DollarSign
} from 'lucide-react';

export default function StartupPage() {
  const [showAddStartup, setShowAddStartup] = useState(false);
  const [startupForm, setStartupForm] = useState({
    name: '',
    role: '',
    stage: '',
    description: '',
    website: '',
    location: '',
    founded: '',
    teamSize: '',
    funding: '',
    tags: []
  });

  const mockStartups = [
    {
      id: 1,
      name: 'TechVenture AI',
      role: 'Co-Founder & CTO',
      stage: 'Seed Funding',
      description: 'AI-powered business intelligence platform for SMEs with advanced analytics and predictive insights.',
      website: 'https://techventure.ai',
      location: 'Bangalore, India',
      founded: '2023-06-15',
      teamSize: 12,
      funding: '$500K',
      tags: ['AI', 'B2B', 'Analytics', 'SaaS'],
      logo: '🤖'
    },
    {
      id: 2,
      name: 'GreenTech Solutions',
      role: 'Technical Advisor',
      stage: 'Series A',
      description: 'Sustainable technology solutions for urban environments focusing on smart waste management.',
      website: 'https://greentech.solutions',
      location: 'Mumbai, India',
      founded: '2022-03-10',
      teamSize: 25,
      funding: '$2.5M',
      tags: ['GreenTech', 'Urban Planning', 'Sustainability', 'IoT'],
      logo: '🌱'
    },
    {
      id: 3,
      name: 'HealthTech Innovations',
      role: 'Co-Founder',
      stage: 'MVP Development',
      description: 'Digital health platform connecting patients with healthcare providers through telemedicine.',
      website: 'https://healthtech.innovations',
      location: 'Delhi, India',
      founded: '2024-01-20',
      teamSize: 8,
      funding: '$100K',
      tags: ['HealthTech', 'Telemedicine', 'Digital Health', 'Mobile'],
      logo: '🏥'
    },
    {
      id: 4,
      name: 'EduLearn Platform',
      role: 'Product Manager',
      stage: 'Pre-Seed',
      description: 'Personalized learning platform using AI to adapt to individual student needs and learning styles.',
      website: 'https://edulearn.platform',
      location: 'Pune, India',
      founded: '2023-11-05',
      teamSize: 6,
      funding: '$50K',
      tags: ['EdTech', 'AI', 'Personalization', 'Learning'],
      logo: '📚'
    }
  ];

  const getStageColor = (stage: string) => {
    const colors: { [key: string]: string } = {
      'Ideation': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      'MVP Development': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'Pre-Seed': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'Seed Funding': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Series A': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'Series B': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Growth Stage': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  const handleAddStartup = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Adding startup:', startupForm);
    setShowAddStartup(false);
    // Reset form
    setStartupForm({
      name: '',
      role: '',
      stage: '',
      description: '',
      website: '',
      location: '',
      founded: '',
      teamSize: '',
      funding: '',
      tags: []
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Startups</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage and track your startup ventures and roles</p>
      </div>

      {/* Startups Grid */}
      <div className="grid gap-6">
        {mockStartups.map((startup) => (
          <Card key={startup.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
                    {startup.logo}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <CardTitle className="text-xl">{startup.name}</CardTitle>
                      <Badge className={getStageColor(startup.stage)}>
                        {startup.stage}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mb-2">
                      <div className="flex items-center">
                        <Building className="w-4 h-4 mr-1" />
                        {startup.role}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {startup.location}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Founded {new Date(startup.founded).getFullYear()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {startup.teamSize} team members
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {startup.funding} raised
                      </div>
                      <div className="flex items-center">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        <a 
                          href={startup.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Website
                        </a>
                      </div>
                    </div>
                  </div>
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

        {/* Add Startup Card */}
        <Dialog open={showAddStartup} onOpenChange={setShowAddStartup}>
          <DialogTrigger asChild>
            <Card className="border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Add Startup</h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  Create a new startup profile or add an existing one you're involved with
                </p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Rocket className="w-5 h-5" />
                <span>Add New Startup</span>
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddStartup} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startup-name">Startup Name *</Label>
                  <Input
                    id="startup-name"
                    placeholder="Enter startup name"
                    value={startupForm.name}
                    onChange={(e) => setStartupForm({...startupForm, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="startup-role">Your Role *</Label>
                  <Select value={startupForm.role} onValueChange={(value) => setStartupForm({...startupForm, role: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="founder">Founder</SelectItem>
                      <SelectItem value="co-founder">Co-Founder</SelectItem>
                      <SelectItem value="cto">CTO</SelectItem>
                      <SelectItem value="ceo">CEO</SelectItem>
                      <SelectItem value="coo">COO</SelectItem>
                      <SelectItem value="advisor">Advisor</SelectItem>
                      <SelectItem value="investor">Investor</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="consultant">Consultant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startup-stage">Current Stage *</Label>
                  <Select value={startupForm.stage} onValueChange={(value) => setStartupForm({...startupForm, stage: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select current stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ideation">Ideation</SelectItem>
                      <SelectItem value="MVP Development">MVP Development</SelectItem>
                      <SelectItem value="Pre-Seed">Pre-Seed</SelectItem>
                      <SelectItem value="Seed Funding">Seed Funding</SelectItem>
                      <SelectItem value="Series A">Series A</SelectItem>
                      <SelectItem value="Series B">Series B</SelectItem>
                      <SelectItem value="Growth Stage">Growth Stage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="startup-founded">Founded Date</Label>
                  <Input
                    id="startup-founded"
                    type="date"
                    value={startupForm.founded}
                    onChange={(e) => setStartupForm({...startupForm, founded: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="startup-description">Description *</Label>
                <Textarea
                  id="startup-description"
                  placeholder="Describe your startup, its mission, and what problem it solves..."
                  value={startupForm.description}
                  onChange={(e) => setStartupForm({...startupForm, description: e.target.value})}
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startup-website">Website URL</Label>
                  <Input
                    id="startup-website"
                    placeholder="https://yourstartup.com"
                    value={startupForm.website}
                    onChange={(e) => setStartupForm({...startupForm, website: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="startup-location">Location</Label>
                  <Input
                    id="startup-location"
                    placeholder="City, Country"
                    value={startupForm.location}
                    onChange={(e) => setStartupForm({...startupForm, location: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startup-team-size">Team Size</Label>
                  <Input
                    id="startup-team-size"
                    type="number"
                    placeholder="Number of team members"
                    value={startupForm.teamSize}
                    onChange={(e) => setStartupForm({...startupForm, teamSize: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="startup-funding">Funding Raised</Label>
                  <Input
                    id="startup-funding"
                    placeholder="e.g., $100K, $1M, Bootstrapped"
                    value={startupForm.funding}
                    onChange={(e) => setStartupForm({...startupForm, funding: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setShowAddStartup(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add Startup
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Empty State */}
      {mockStartups.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Rocket className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No startups yet</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Start your entrepreneurial journey by adding your first startup
          </p>
          <Button onClick={() => setShowAddStartup(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Startup
          </Button>
        </div>
      )}
    </div>
  );
}