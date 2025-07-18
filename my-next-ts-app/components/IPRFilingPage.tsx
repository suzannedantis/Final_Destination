'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Shield, HelpCircle } from 'lucide-react';
import IPRCard from './ipr/IPRCard';
import AddIPRForm, { IPRFormData } from './ipr/AddIPRForm';
import StepsModal from './ipr/StepsModal';
import HelpSection from './ipr/HelpSection';
import DeleteConfirmModal from './ipr/DeleteConfirmModal';

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

interface IPRStep {
  id: number;
  title: string;
  completed: boolean;
  uploads: File[];
  additionalData?: any;
}

export default function IPRFilingPage() {
  // State management
  const [showAddIPR, setShowAddIPR] = useState(false);
  const [showStepsModal, setShowStepsModal] = useState(false);
  const [selectedIPR, setSelectedIPR] = useState<IPRFiling | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteIPRId, setDeleteIPRId] = useState<string | null>(null);
  const [showHelpSection, setShowHelpSection] = useState(false);

  // Mock data - this will be replaced with API calls
  const [mockIPRFilings, setMockIPRFilings] = useState<IPRFiling[]>([
    {
      id: '1',
      title: 'AI-Powered Crop Yield Prediction System',
      type: 'Patent',
      description: 'Machine learning algorithm for predicting crop yields using satellite imagery and weather data',
      startDate: '2024-01-15',
      lastUpdated: '2024-01-20',
      progress: 43,
      currentStep: 3,
      status: 'active',
      steps: [
        { id: 1, title: 'Patent Search Report', completed: true, uploads: [] },
        { id: 2, title: 'Filing the Patent Application', completed: true, uploads: [] },
        { id: 3, title: 'Publication of Application', completed: false, uploads: [] },
        { id: 4, title: 'Request for Examination', completed: false, uploads: [] },
        { id: 5, title: 'Response to Objections', completed: false, uploads: [] },
        { id: 6, title: 'Grant of Patent', completed: false, uploads: [] },
        { id: 7, title: 'Renewal of Patent', completed: false, uploads: [] }
      ]
    },
    {
      id: '2',
      title: 'Smart Waste Management IoT System',
      type: 'Patent',
      description: 'IoT-based waste collection optimization system for urban environments',
      startDate: '2023-08-10',
      lastUpdated: '2024-01-18',
      progress: 86,
      currentStep: 6,
      status: 'active',
      steps: [
        { id: 1, title: 'Patent Search Report', completed: true, uploads: [] },
        { id: 2, title: 'Filing the Patent Application', completed: true, uploads: [] },
        { id: 3, title: 'Publication of Application', completed: true, uploads: [] },
        { id: 4, title: 'Request for Examination', completed: true, uploads: [] },
        { id: 5, title: 'Response to Objections', completed: true, uploads: [] },
        { id: 6, title: 'Grant of Patent', completed: true, uploads: [] },
        { id: 7, title: 'Renewal of Patent', completed: false, uploads: [] }
      ]
    },
    {
      id: '3',
      title: 'EcoTech Solutions Brand Logo',
      type: 'Trademark',
      description: 'Brand trademark registration for sustainable technology company',
      startDate: '2023-12-01',
      lastUpdated: '2024-01-10',
      progress: 25,
      currentStep: 2,
      status: 'active',
      steps: [
        { id: 1, title: 'Trademark Search', completed: true, uploads: [] },
        { id: 2, title: 'Filing Application', completed: false, uploads: [] },
        { id: 3, title: 'Examination', completed: false, uploads: [] },
        { id: 4, title: 'Publication', completed: false, uploads: [] },
        { id: 5, title: 'Registration', completed: false, uploads: [] }
      ]
    }
  ]);

  // Event handlers
  const handleAddIPR = (formData: IPRFormData) => {
    const newIPR: IPRFiling = {
      id: Date.now().toString(),
      title: formData.title,
      type: formData.type,
      description: formData.description,
      startDate: formData.startDate,
      lastUpdated: new Date().toISOString().split('T')[0],
      progress: 0,
      currentStep: 1,
      status: 'active',
      steps: formData.type === 'Patent' ? createPatentSteps() : createGenericSteps()
    };

    setMockIPRFilings([...mockIPRFilings, newIPR]);
  };

  const handleViewSteps = (ipr: IPRFiling) => {
    setSelectedIPR(ipr);
    setShowStepsModal(true);
  };

  const handleDeleteIPR = (id: string) => {
    setDeleteIPRId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (deleteIPRId) {
      setMockIPRFilings(mockIPRFilings.filter(ipr => ipr.id !== deleteIPRId));
      setShowDeleteConfirm(false);
      setDeleteIPRId(null);
    }
  };

  const handleUpdateStep = (stepId: number, completed: boolean) => {
    if (!selectedIPR) return;

    const updatedIPR = { ...selectedIPR };
    const stepIndex = updatedIPR.steps.findIndex(step => step.id === stepId);
    
    if (stepIndex !== -1) {
      updatedIPR.steps[stepIndex].completed = completed;
      
      // Update progress and current step
      const completedSteps = updatedIPR.steps.filter(step => step.completed).length;
      updatedIPR.progress = Math.round((completedSteps / updatedIPR.steps.length) * 100);
      updatedIPR.currentStep = completed ? stepId + 1 : stepId;
      updatedIPR.lastUpdated = new Date().toISOString().split('T')[0];

      // Update in the main array
      setMockIPRFilings(mockIPRFilings.map(ipr => 
        ipr.id === selectedIPR.id ? updatedIPR : ipr
      ));
      
      setSelectedIPR(updatedIPR);
    }
  };

  // Helper functions for creating step structures
  const createPatentSteps = () => [
    { id: 1, title: 'Patent Search Report', completed: false, uploads: [], additionalData: {} },
    { id: 2, title: 'Filing the Patent Application', completed: false, uploads: [], additionalData: {} },
    { id: 3, title: 'Publication of Application', completed: false, uploads: [], additionalData: {} },
    { id: 4, title: 'Request for Examination', completed: false, uploads: [], additionalData: {} },
    { id: 5, title: 'Response to Objections', completed: false, uploads: [], additionalData: {} },
    { id: 6, title: 'Grant of Patent', completed: false, uploads: [], additionalData: {} },
    { id: 7, title: 'Renewal of Patent', completed: false, uploads: [], additionalData: {} }
  ];

  const createGenericSteps = () => [
    { id: 1, title: 'Search', completed: false, uploads: [], additionalData: {} },
    { id: 2, title: 'Filing', completed: false, uploads: [], additionalData: {} },
    { id: 3, title: 'Examination', completed: false, uploads: [], additionalData: {} },
    { id: 4, title: 'Publication', completed: false, uploads: [], additionalData: {} },
    { id: 5, title: 'Registration', completed: false, uploads: [], additionalData: {} }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">IPR Filing & Tracking</h1>
            <p className="text-gray-600 dark:text-gray-300">Track and manage your intellectual property filing process</p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              onClick={() => setShowHelpSection(!showHelpSection)}
              className="flex items-center space-x-2"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Help & FAQs</span>
            </Button>
            <Button 
              onClick={() => setShowAddIPR(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add New IPR Filing</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <HelpSection 
        isVisible={showHelpSection} 
        onClose={() => setShowHelpSection(false)} 
      />

      {/* IPR Filings Grid */}
      <div className="grid gap-6">
        {mockIPRFilings.map((ipr) => (
          <IPRCard
            key={ipr.id}
            ipr={ipr}
            onViewSteps={handleViewSteps}
            onDelete={handleDeleteIPR}
          />
        ))}

        {/* Empty State */}
        {mockIPRFilings.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No IPR filings yet</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Start protecting your intellectual property by filing your first IPR
            </p>
            <Button onClick={() => setShowAddIPR(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First IPR Filing
            </Button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddIPRForm
        isOpen={showAddIPR}
        onClose={() => setShowAddIPR(false)}
        onSubmit={handleAddIPR}
      />

      <StepsModal
        isOpen={showStepsModal}
        onClose={() => setShowStepsModal(false)}
        ipr={selectedIPR}
        onUpdateStep={handleUpdateStep}
      />

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}