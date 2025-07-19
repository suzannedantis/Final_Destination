'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Shield, HelpCircle, Search, Loader2, MessageCircle, Send, X, Minimize2 } from 'lucide-react';
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

interface PatentSearchResult {
  title: string;
  patentNumber: string;
  inventors: string[];
  filingDate: string;
  description: string;
  keyClaims: string[];
  status: string;
  similarityScore: number;
}

interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PatentSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  
  // Chatbot state management
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  
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

  // Patent search functionality
  const handlePatentSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setShowSearchResults(true);

    try {
      const response = await fetch('/api/patent-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setSearchResults(data.patents || []);
      } else {
        console.error('Patent search failed:', data.message);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching patents:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handlePatentSearch();
    }
  };

  // Chatbot functionality
  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: chatInput.trim(),
      role: 'user',
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/ipr-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          chatHistory: chatMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          role: 'assistant',
          timestamp: data.timestamp
        };
        setChatMessages(prev => [...prev, assistantMessage]);
      } else {
        console.error('Chat error:', data.message);
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          content: 'Sorry, I encountered an error. Please try again.',
          role: 'assistant',
          timestamp: new Date().toISOString()
        };
        setChatMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleChatKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const openChatbot = () => {
    setShowChatbot(true);
    setIsChatMinimized(false);
    
    // Add welcome message if no messages exist
    if (chatMessages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        content: 'Hi there! I\'m here to help with your IP questions. Whether you\'re filing a patent, registering a trademark, or just need to understand the process better - feel free to ask me anything!',
        role: 'assistant',
        timestamp: new Date().toISOString()
      };
      setChatMessages([welcomeMessage]);
    }
  };

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

      {/* Patent Search Section */}
      <div className="mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Patent Search</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">Search for existing patents to check for prior art before filing your application</p>
          
          <div className="flex space-x-3">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Enter keywords, technology description, or invention details..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="w-full"
              />
            </div>
            <Button
              onClick={handlePatentSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="flex items-center space-x-2"
            >
              {isSearching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              <span>{isSearching ? 'Searching...' : 'Search Patents'}</span>
            </Button>
          </div>
        </div>

        {/* Search Results */}
        {showSearchResults && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Search Results for "{searchQuery}"
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSearchResults(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ×
                </Button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Found {searchResults.length} related patents
              </p>
            </div>

            <div className="p-6">
              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin mr-2" />
                  <span className="text-gray-600 dark:text-gray-300">Searching patents...</span>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 dark:text-gray-300">No similar patents found for your search query.</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">This might indicate good novelty for your invention!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {searchResults.map((patent, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                            {patent.title}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                            <span>Patent: {patent.patentNumber}</span>
                            <span>Filed: {patent.filingDate}</span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              patent.status === 'Active'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : patent.status === 'Expired'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}>
                              {patent.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              Similarity: {patent.similarityScore}/10
                            </div>
                            <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-1">
                              <div
                                className={`h-2 rounded-full ${
                                  patent.similarityScore >= 8
                                    ? 'bg-red-500'
                                    : patent.similarityScore >= 6
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                                }`}
                                style={{ width: `${patent.similarityScore * 10}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {patent.description}
                      </p>

                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          Inventors: {patent.inventors.join(', ')}
                        </p>
                      </div>

                      {patent.keyClaims && patent.keyClaims.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Key Claims:</p>
                          <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                            {patent.keyClaims.slice(0, 3).map((claim, claimIndex) => (
                              <li key={claimIndex} className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>{claim}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

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

      {/* Floating Queries Button */}
      {!showChatbot && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            onClick={openChatbot}
            className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center"
            title="IPR Support Queries"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
          <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            ?
          </div>
        </div>
      )}

      {/* Chatbot Panel */}
      {showChatbot && (
        <div className={`fixed bottom-6 right-6 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
          isChatMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
        }`}>
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-blue-600 text-white rounded-t-lg">
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-5 h-5" />
              <h3 className="font-semibold">IPR Support</h3>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsChatMinimized(!isChatMinimized)}
                className="text-white hover:bg-blue-700 p-1 h-8 w-8"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChatbot(false)}
                className="text-white hover:bg-blue-700 p-1 h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Chat Content */}
          {!isChatMinimized && (
            <>
              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto h-80 space-y-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-600 text-white rounded-br-none'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {/* Loading indicator */}
                {isChatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg rounded-bl-none">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">Typing...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex space-x-2">
                  <Input
                    type="text"
                    placeholder="Ask about IPR filing, laws, procedures..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyPress={handleChatKeyPress}
                    disabled={isChatLoading}
                    className="flex-1 text-sm"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isChatLoading || !chatInput.trim()}
                    size="sm"
                    className="px-3"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Get help with patents, trademarks, copyrights, and IPR procedures
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Rest of your existing content would go here */}

    </div>
  );
}