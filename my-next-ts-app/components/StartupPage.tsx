'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle, Users2, BookOpen, User, ExternalLink } from 'lucide-react';

const projects = [
  {
    title: 'Nexus: Smart Home IoT Ecosystem',
    year: 2023,
    contributors: ['David Park'],
    publisher: 'Times of India',
    author: 'Suzanne',
    description: 'Smart City Innovation Excellence Award By InnovateLab',
    document: '#',
    tags: ['Internet of Things', 'Research Paper', 'Smart Home'],
    status: 'Idea',
  },
  {
    title: 'Zero: An Open-Source Legged Robot Dog',
    year: 2024,
    contributors: ['Yash Hingu', 'Arvind Yadav'],
    publisher: 'Atharva Awards for Excellence in Education',
    author: 'Suzanne',
    description:
      'Zero is a low-cost, open-source quadruped robot designed to introduce students and makers to legged locomotion. It combines a custom CAD design, simplified inverse kinematics, and PS2 controller integration.',
    document: '#',
    tags: ['Robotics', 'Open Source', 'STEM'],
    status: 'Idea',
  },
];

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#f7faff] to-[#e3f2fd] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-gray-900">Projects & Research</h1>
        <p className="text-gray-500 mb-8 text-md">
          Explore research projects and academic contributions from the startup community.
        </p>

        <div className="space-y-6">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      <span className="font-semibold text-lg">{project.title}</span>
                    </div>
                    <div className="text-sm text-gray-500 flex flex-wrap items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> Registered {new Date().toLocaleDateString('en-GB')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users2 className="h-4 w-4" /> {project.status} – Bootstrapped
                      </span>
                      <span className="flex items-center gap-1">
                        <ExternalLink className="h-4 w-4" /> Website
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {project.description}
                    </p>
                    <a
                      href={project.document}
                      target="_blank"
                      className="text-green-700 text-sm font-medium flex items-center gap-1 hover:underline"
                    >
                      <BookOpen className="h-4 w-4" /> View Pitch Deck
                    </a>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <Badge className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {project.status}
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag, i) => (
                    <Badge key={i} className="rounded-full bg-gray-100 text-gray-700 px-3 py-1 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
