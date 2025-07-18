'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Shield, CheckCircle, X } from 'lucide-react';

interface HelpSectionProps {
  isVisible: boolean;
  onClose: () => void;
}

const helpSections = [
  {
    title: 'Patent Infringement Types',
    content: [
      'Direct Infringement: Making, using, selling patented invention',
      'Indirect Infringement: Inducing others to infringe',
      'Contributory Infringement: Providing components for infringement',
      'Literal Infringement: Product/process matches patent claims exactly',
      'Doctrine of Equivalents: Substantially similar function/result'
    ]
  },
  {
    title: 'Patent Defenses',
    content: [
      'Invalid Patent: Challenging patent validity',
      'Non-Infringement: Product doesn\'t fall under patent scope',
      'Patent Misuse: Improper use of patent rights',
      'Experimental Use: Research and development purposes',
      'License Defense: Valid license to use patented technology'
    ]
  },
  {
    title: 'Patent Licensing',
    content: [
      'Cross-Licensing: Mutual licensing between companies',
      'Compulsory Licensing: Government-mandated licensing',
      'Exclusive Licensing: Single licensee rights',
      'Non-Exclusive Licensing: Multiple licensee rights',
      'Field-of-Use Licensing: Limited to specific applications'
    ]
  },
  {
    title: 'Patent Enforcement',
    content: [
      'Legal Notice: First step in enforcement process',
      'Suit under Section 104: Filing infringement lawsuit',
      'Injunction: Court order to stop infringement',
      'Damages: Monetary compensation for losses',
      'Seizure: Confiscation of infringing products'
    ]
  }
];

export default function HelpSection({ isVisible, onClose }: HelpSectionProps) {
  if (!isVisible) return null;

  return (
    <Card className="mb-8 border-blue-200 dark:border-blue-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5" />
            <span>IPR Help & Resources</span>
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {helpSections.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>{section.title}</span>
              </h3>
              <ul className="space-y-2">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-sm text-gray-600 dark:text-gray-300 flex items-start space-x-2">
                    <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}