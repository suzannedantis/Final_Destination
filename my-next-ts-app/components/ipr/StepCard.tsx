'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  HelpCircle, 
  Upload, 
  Calendar 
} from 'lucide-react';

interface IPRStep {
  id: number;
  title: string;
  completed: boolean;
  uploads: File[];
  additionalData?: any;
}

interface StepInfo {
  id: number;
  title: string;
  description: string;
  uploads: string[];
  checkboxText: string;
  warning?: string;
  info?: string;
}

interface StepCardProps {
  step: IPRStep;
  stepInfo: StepInfo;
  canAccess: boolean;
  currentStep: number;
  onUpdateStep: (stepId: number, completed: boolean) => void;
  iprStartDate: string;
}

export default function StepCard({ 
  step, 
  stepInfo, 
  canAccess, 
  currentStep, 
  onUpdateStep, 
  iprStartDate 
}: StepCardProps) {
  const getStepStatus = (step: IPRStep, currentStep: number) => {
    if (step.completed) return { color: 'text-green-600', icon: <CheckCircle className="w-5 h-5" /> };
    if (step.id === currentStep) return { color: 'text-yellow-600', icon: <Clock className="w-5 h-5" /> };
    if (step.id < currentStep) return { color: 'text-red-600', icon: <AlertTriangle className="w-5 h-5" /> };
    return { color: 'text-gray-400', icon: <Clock className="w-5 h-5" /> };
  };

  const calculateExpiryDate = (startDate: string) => {
    const start = new Date(startDate);
    start.setFullYear(start.getFullYear() + 20);
    return start.toISOString().split('T')[0];
  };

  const stepStatus = getStepStatus(step, currentStep);

  return (
    <Card className={`${canAccess ? '' : 'opacity-50'} ${step.completed ? 'border-green-200 dark:border-green-800' : ''}`}>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step.completed ? 'bg-green-100 dark:bg-green-900' : 
            step.id === currentStep ? 'bg-yellow-100 dark:bg-yellow-900' : 
            'bg-gray-100 dark:bg-gray-800'
          }`}>
            <span className={`text-sm font-semibold ${stepStatus.color}`}>
              {step.id}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Step {step.id}: {step.title}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <Checkbox
                checked={step.completed}
                onCheckedChange={(checked) => onUpdateStep(step.id, checked as boolean)}
                disabled={!canAccess}
              />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {stepInfo.checkboxText}
              </span>
            </div>
          </div>
          <div className={stepStatus.color}>
            {stepStatus.icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm">
          {stepInfo.description}
        </p>

        {stepInfo.warning && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5" />
              <p className="text-red-700 dark:text-red-300 text-sm">{stepInfo.warning}</p>
            </div>
          </div>
        )}

        {stepInfo.info && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-4">
            <div className="flex items-start space-x-2">
              <HelpCircle className="w-4 h-4 text-blue-600 mt-0.5" />
              <p className="text-blue-700 dark:text-blue-300 text-sm">{stepInfo.info}</p>
            </div>
          </div>
        )}

        {stepInfo.uploads && stepInfo.uploads.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900 dark:text-white text-sm">Required Documents:</h4>
            {stepInfo.uploads.map((uploadType, uploadIndex) => (
              <div key={uploadIndex} className="flex items-center space-x-3">
                <Upload className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{uploadType}</span>
                <Button variant="outline" size="sm" disabled={!canAccess}>
                  <Upload className="w-3 h-3 mr-1" />
                  Upload
                </Button>
              </div>
            ))}
          </div>
        )}

        {step.id === 7 && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Patent Expiry Date: {calculateExpiryDate(iprStartDate)}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Patent valid for 20 years from filing date
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}