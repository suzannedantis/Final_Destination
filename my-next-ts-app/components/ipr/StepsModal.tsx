'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { FileText } from 'lucide-react';
import StepCard from './StepCard';
import RejectionPanel from './RejectionPanel';

interface IPRStep {
  id: number;
  title: string;
  completed: boolean;
  uploads: File[];
  additionalData?: any;
}

interface IPRFiling {
  id: string;
  title: string;
  type: string;
  description: string;
  startDate: string;
  lastUpdated: string;
  progress: number;
  currentStep: number;
  steps: IPRStep[];
  status: 'active' | 'completed' | 'rejected';
}

interface StepsModalProps {
  isOpen: boolean;
  onClose: () => void;
  ipr: IPRFiling | null;
  onUpdateStep: (stepId: number, completed: boolean) => void;
}

const patentSteps = [
  {
    id: 1,
    title: 'Patent Search Report',
    description: 'Use https://iprsearch.ipindia.gov.in/PublicSearch/ or consult a Patent Attorney (7–10 days). Warn users about rejection reasons (no novelty, living organism, discovery, etc.).',
    uploads: ['Search report (optional)'],
    checkboxText: "I've completed the patent search",
    warning: 'Common rejection reasons: lack of novelty, living organism patents, mere discoveries'
  },
  {
    id: 2,
    title: 'Filing the Patent Application',
    description: 'Submit required forms with complete application details',
    uploads: ['Form 1: Applicant Details', 'Form 2: Invention + Diagram', 'Form 3: Statement & Undertaking', 'Form 5: Declaration of Inventorship', 'Form 28: For startups/small entities (80% fee benefit)'],
    checkboxText: 'Filed application with Forms',
    info: 'Form 28 provides 80% fee reduction for startups and small entities'
  },
  {
    id: 3,
    title: 'Publication of Application',
    description: 'Standard publishing = 18 months, early possible with Form 9. Fee: ₹2,500 (startups), ₹12,500 (others)',
    uploads: ['Form 9 (optional for early publication)'],
    checkboxText: 'Application published or early publication requested',
    info: 'Early publication accelerates the process but makes invention public sooner'
  },
  {
    id: 4,
    title: 'Request for Examination',
    description: 'Form 18 (Normal): ₹4,000 (individual), ₹20,000 (company), valid up to 31 months. Form 18A (Expedited): ₹8,000 (startup), ₹60,000 (company), needs Form 9. Exam time: 6–12 months (fast track)',
    uploads: ['Form 18 or 18A'],
    checkboxText: 'Requested for Examination',
    info: 'Expedited examination reduces waiting time significantly'
  },
  {
    id: 5,
    title: 'Response to Objections',
    description: 'Must respond within 6 months, extension available (3 months, ₹400)',
    uploads: ['Reply draft', 'Form 4 (if extension used)'],
    checkboxText: 'Responded to FER',
    warning: 'Failure to respond within deadline results in application abandonment'
  },
  {
    id: 6,
    title: 'Grant of Patent',
    description: 'Once granted, patent is valid for 20 years from filing date',
    uploads: ['Grant Certificate'],
    checkboxText: 'Patent granted',
    info: 'Patent provides exclusive rights for 20 years from filing date'
  },
  {
    id: 7,
    title: 'Renewal of Patent',
    description: 'Renewal required to retain rights; expired patents enter the public domain',
    uploads: [],
    checkboxText: 'Renewed or marked for future renewal',
    info: 'Annual renewal fees increase over time. Missing renewal results in patent expiry'
  }
];

export default function StepsModal({ isOpen, onClose, ipr, onUpdateStep }: StepsModalProps) {
  const canAccessStep = (stepId: number) => {
    if (!ipr) return false;
    if (stepId === 1) return true;
    
    const previousStep = ipr.steps.find(step => step.id === stepId - 1);
    return previousStep?.completed || false;
  };

  const calculateExpiryDate = (startDate: string) => {
    const start = new Date(startDate);
    start.setFullYear(start.getFullYear() + 20);
    return start.toISOString().split('T')[0];
  };

  if (!ipr) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>{ipr.title} - Filing Steps</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-gray-600">{ipr.progress}%</span>
            </div>
            <Progress value={ipr.progress} className="h-3" />
          </div>

          {/* Steps */}
          <div className="space-y-6">
            {(ipr.type === 'Patent' ? patentSteps : []).map((stepInfo) => {
              const step = ipr.steps.find(s => s.id === stepInfo.id);
              if (!step) return null;

              const canAccess = canAccessStep(step.id);

              return (
                <StepCard
                  key={step.id}
                  step={step}
                  stepInfo={stepInfo}
                  canAccess={canAccess}
                  currentStep={ipr.currentStep}
                  onUpdateStep={onUpdateStep}
                  iprStartDate={ipr.startDate}
                />
              );
            })}

            {/* Rejection Panel */}
            {/* <RejectionPanel /> */}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}