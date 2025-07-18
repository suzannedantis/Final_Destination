'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Upload, Clock } from 'lucide-react';

export default function RejectionPanel() {
  return (
    <Card className="border-red-200 dark:border-red-800">
      <CardHeader>
        <CardTitle className="text-red-700 dark:text-red-300 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5" />
          <span>Patent Rejection Handling</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox />
            <span className="text-sm text-gray-700 dark:text-gray-300">Was your patent refused?</span>
          </div>
          <div className="flex items-center space-x-3">
            <Upload className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">High Court appeal document</span>
            <Button variant="outline" size="sm">
              <Upload className="w-3 h-3 mr-1" />
              Upload
            </Button>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Clock className="w-4 h-4 text-yellow-600 mt-0.5" />
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                Appeal within 3 months of rejection to High Court
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}