'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAllStartups } from '@/lib/startupService';
import {
  Calendar,
  Trophy,
  Loader2
} from 'lucide-react';

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

export default function StartupPage() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loadingSummary, setLoadingSummary] = useState<number | null>(null);

  useEffect(() => {
    fetchStartups();
  }, []);

  const fetchStartups = async () => {
    try {
      const allStartups = await getAllStartups();
      setStartups(allStartups);
    } catch (error) {
      console.error("Error fetching startups:", error);
    }
  };

  const getStageColor = (stage: string) => {
    const colors: { [key: string]: string } = {
      'Idea': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      'Prototype': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'MVP': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'Seed': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Series A': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'Series B': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'Growth Stage': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      'Ideation': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      'MVP Development': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'Pre-Seed': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'Seed Funding': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  const handleSummarizeStartup = async (startup: Startup) => {
    setLoadingSummary(startup.id);
    
    try {
      const response = await fetch('/api/summarize-startup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: startup.name,
          idea_summary: startup.idea_summary,
          stage: startup.stage,
          funding_status: startup.funding_status,
          website: startup.website,
          registered_on: startup.registered_on
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Show specific error message from the API
        alert(`Error: ${data.error || 'Failed to summarize startup'}`);
        return;
      }
      
      // Show the summary in an alert for now (you can replace this with a modal later)
      alert(`Startup Summary:\n\n${data.summary}`);
      
    } catch (error) {
      console.error('Error summarizing startup:', error);
      alert('Network error: Failed to connect to the summarization service. Please check your internet connection and try again.');
    } finally {
      setLoadingSummary(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">All Startups</h1>
        <p className="text-gray-600 dark:text-gray-300">Discover and explore startup ventures from our community</p>
      </div>

      {/* Startups Grid */}
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
                <div className="flex items-center space-x-2">
                  <Badge className={getStageColor(startup.stage)}>
                    {startup.stage}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300 mb-4">{startup.idea_summary}</p>
              {/* <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleSummarizeStartup(startup)}
                  disabled={loadingSummary === startup.id}
                >
                  {loadingSummary === startup.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Summarizing...
                    </>
                  ) : (
                    'Summarize Startup'
                  )}
                </Button>
              </div> */}
            </CardContent>
          </Card>
        ))}

        {startups.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No startups yet</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Check back later for startup ventures from our community
            </p>
          </div>
        )}
      </div>
    </div>
  );
}