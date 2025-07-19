'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Shield, HelpCircle } from 'lucide-react';
import IPRCard from './ipr/IPRCard';
import AddIPRForm, { IPRFormData } from './ipr/AddIPRForm';
import StepsModal from './ipr/StepsModal';
import HelpSection from './ipr/HelpSection';
import DeleteConfirmModal from './ipr/DeleteConfirmModal';
import PatentApplicationForm from './ipr/Form1';

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
  const [showForm1, setShowForm1] = useState(false);
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
            {/* <Button
              onClick={() => setShowPatentForm(true)}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>File an IPR</span>
            </Button> */}
          </div>
        </div>
      </div>

      {/* Help Section */}
      <HelpSection
        isVisible={showHelpSection}
        onClose={() => setShowHelpSection(false)}
      />

      {/* Process Table - Added below help section */}
      <div className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-20">
                  Sr. No.
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Process Title
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-40">
                  Download Form
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-32">
                  Fill Form
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white text-center">
                  1
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400 font-medium">
                  The First Schedule Fees
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                  <div className="flex flex-col space-y-2">
                    <a
                      href="/Fees.pdf"
                      download="Fees.pdf"
                      className="inline-block px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors duration-200 w-fit mx-auto"
                    >
                      📄 Fees
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                  -
                </td>
              </tr>
              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white text-center">
                  2
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400 font-medium">
                  Form 1
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                  <div className="flex flex-col space-y-2">
                    <a
                      href="/Form 1.pdf"
                      download="Form 1.pdf"
                      className="inline-block px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 transition-colors duration-200 w-fit mx-auto"
                    >
                      📄 Form 1
                    </a>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-600 border-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-blue-900"
                    onClick={() => setShowForm1(true)}
                  >
                    Form 1
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {showForm1 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 max-w-6xl w-full max-h-[90vh] overflow-y-auto relative">
              <button
                onClick={() => setShowForm1(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
              <PatentApplicationForm />
            </div>
          </div>
        )}
      </div>

      {/* Rest of your existing content would go here */}

    </div>
  );
}