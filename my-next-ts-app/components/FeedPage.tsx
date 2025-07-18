'use client';

import { useState, useEffect } from 'react';

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

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Innovation Feed</h1>
        <p className="text-gray-600 dark:text-gray-300">Discover startups, research projects, and innovations from the community</p>
      </div>
    </div>
  );
}