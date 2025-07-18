'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Shield, FileText, Clock, CheckCircle, HelpCircle, BookOpen, Users, Award } from 'lucide-react';

export default function IPRFilingPage() {
  const iprResources = [
    {
      title: 'IP India Portal',
      description: 'Official portal for filing patents, trademarks, and industrial designs in India',
      url: 'https://ipindiaonline.gov.in/',
      icon: '🇮🇳',
      type: 'Official Portal'
    },
    {
      title: 'Patent Application Filing',
      description: 'Direct access to patent application filing system',
      url: 'https://ipindiaonline.gov.in/epatentfiling/',
      icon: '📋',
      type: 'Patent Filing'
    },
    {
      title: 'Trademark Registration',
      description: 'Online trademark registration and search portal',
      url: 'https://ipindiaonline.gov.in/trademark/',
      icon: '™️',
      type: 'Trademark'
    }
  ];

  const educationalCards = [
    {
      title: 'What is Intellectual Property?',
      description: 'Intellectual Property (IP) refers to creations of the mind, including inventions, literary and artistic works, designs, symbols, names, and images used in commerce.',
      icon: <BookOpen className="w-8 h-8 text-blue-600" />,
      details: [
        'Legal protection for innovations and creative works',
        'Exclusive rights to creators and inventors',
        'Encourages innovation and creativity',
        'Provides competitive advantage in markets'
      ]
    },
    {
      title: 'Types of IPR',
      description: 'There are several types of intellectual property rights, each protecting different aspects of innovation and creativity.',
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      details: [
        'Patents: Protect inventions and technical innovations',
        'Trademarks: Protect brand names, logos, and symbols',
        'Copyrights: Protect original works of authorship',
        'Trade Secrets: Protect confidential business information'
      ]
    },
    {
      title: 'Filing Workflow',
      description: 'The IPR filing process involves several steps to ensure proper protection of your intellectual property.',
      icon: <FileText className="w-8 h-8 text-green-600" />,
      details: [
        'Conduct prior art search and feasibility analysis',
        'Prepare and file application with required documents',
        'Review and respond to examination reports',
        'Obtain grant and maintain your IP rights'
      ]
    }
  ];

  const filingSteps = [
    {
      step: 1,
      title: 'Research & Analysis',
      description: 'Conduct thorough prior art search',
      icon: <HelpCircle className="w-5 h-5" />,
      status: 'pending'
    },
    {
      step: 2,
      title: 'Application Preparation',
      description: 'Prepare detailed application documents',
      icon: <FileText className="w-5 h-5" />,
      status: 'pending'
    },
    {
      step: 3,
      title: 'Filing & Payment',
      description: 'Submit application and pay required fees',
      icon: <Clock className="w-5 h-5" />,
      status: 'pending'
    },
    {
      step: 4,
      title: 'Examination',
      description: 'Review by patent office and respond to queries',
      icon: <Users className="w-5 h-5" />,
      status: 'pending'
    },
    {
      step: 5,
      title: 'Grant & Maintenance',
      description: 'Obtain grant and maintain IP rights',
      icon: <Award className="w-5 h-5" />,
      status: 'pending'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">IPR Filing & Management</h1>
        <p className="text-gray-600 dark:text-gray-300">Protect your innovations with comprehensive intellectual property management</p>
      </div>

      {/* Quick Access Links */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Access to IPR Portals</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {iprResources.map((resource, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{resource.icon}</div>
                    <div>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {resource.type}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">{resource.description}</p>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => window.open(resource.url, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Visit Portal
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Filing Process Timeline */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">IPR Filing Process</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {filingSteps.map((step, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">{step.step}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="text-gray-500 dark:text-gray-400">{step.icon}</div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{step.description}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <Badge variant="outline" className="text-xs">
                      Pending
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Educational Content */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Understanding IPR</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {educationalCards.map((card, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-3">
                  {card.icon}
                  <CardTitle className="text-lg">{card.title}</CardTitle>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{card.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {card.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{detail}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">1,234</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Patents Filed</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">567</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Trademarks Registered</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">89</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Copyrights Filed</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">42</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Design Patents</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}