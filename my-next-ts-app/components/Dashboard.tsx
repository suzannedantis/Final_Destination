'use client';
import { UserProfile } from '@/app/page';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun, LogOut, Zap } from 'lucide-react';
import FeedPage from '@/components/FeedPage';
import IPRFilingPage from '@/components/IPRFilingPage';
import ProfilePage from '@/components/ProfilePage';
import StartupPage from '@/components/StartupPage';
import ProjectPage from '@/components/ProjectPage';

interface DashboardProps {
  onLogout: () => void;
  user: UserProfile | null;
}

export default function Dashboard({ onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('feed');
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Load user data
    const userData = localStorage.getItem('startlink_user');
    if (userData) {
      setUser(JSON.parse(userData));
    }

    // Check theme preference
    const theme = localStorage.getItem('startlink_theme');
    if (theme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('startlink_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('startlink_theme', 'light');
    }
  };

  const tabs = [
    { id: 'feed', label: 'Feed', icon: '📰' },
    { id: 'startup', label: 'Startup', icon: '🚀' },
    { id: 'project', label: 'Project / Research', icon: '🔬' },
    { id: 'ipr', label: 'IPR Filing', icon: '📋' },
    { id: 'profile', label: 'Profile', icon: '👤' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return <FeedPage />;
      case 'startup':
        return <StartupPage />;
      case 'project':
        return <ProjectPage />;
      case 'ipr':
        return <IPRFilingPage />;
      case 'profile':
        return <ProfilePage user={user} />;
      default:
        return <FeedPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">StartLink</span>
            </div>

            <nav className="flex space-x-6">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>

            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={toggleTheme}>
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
}