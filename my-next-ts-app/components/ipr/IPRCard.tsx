'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Edit,
  Trash2,
  ExternalLink
} from 'lucide-react';

interface IPRFiling {
  id: string;
  title: string;
  type: string;
  description: string;
  startDate: string;
  lastUpdated: string;
  progress: number;
  currentStep: number;
  status: 'active' | 'completed' | 'rejected';
}

interface IPRCardProps {
  ipr: IPRFiling;
  onViewSteps: (ipr: IPRFiling) => void;
  onDelete: (id: string) => void;
}

export default function IPRCard({ ipr, onViewSteps, onDelete }: IPRCardProps) {
  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'active': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'rejected': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  const calculateExpiryDate = (startDate: string) => {
    const start = new Date(startDate);
    start.setFullYear(start.getFullYear() + 20);
    return start.toISOString().split('T')[0];
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <CardTitle className="text-xl">{ipr.title}</CardTitle>
              <Badge className={getStatusColor(ipr.status)}>
                {ipr.status.charAt(0).toUpperCase() + ipr.status.slice(1)}
              </Badge>
              <Badge variant="outline">{ipr.type}</Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Started: {new Date(ipr.startDate).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Updated: {new Date(ipr.lastUpdated).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                Step {ipr.currentStep-1} of 7
              </div>
            </div>
            <div className="mb-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">{ipr.progress}%</span>
              </div>
              <Progress value={ipr.progress} className="h-2" />
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm">{ipr.description}</p>
            {ipr.type === 'Patent' && (
              <div className="mt-3 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>Patent Expiry: {calculateExpiryDate(ipr.startDate)}</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onViewSteps(ipr)}
            >
              View / Update Steps
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-red-600 hover:text-red-700"
              onClick={() => onDelete(ipr.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}