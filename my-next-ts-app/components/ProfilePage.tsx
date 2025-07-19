'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  User, 
  Edit, 
  Plus, 
  Calendar, 
  MapPin, 
  Mail, 
  Building, 
  FolderOpen,
  Rocket,
  FileText,
  MessageSquare,
  CheckCircle,
  Clock,
  AlertCircle,
  Trophy,
  Users,
  Code,
  BookOpen
} from 'lucide-react';

interface ProfilePageProps {
  user: any;
}

export default function ProfilePage({ user }: ProfilePageProps) {


  return (
    <div className="max-w-6xl mx-auto">
      {/* Profile Header */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name || 'John Doe'}</h1>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">{user?.designation || 'Senior Researcher'}</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={user?.name} />
                      </div>
                      <div>
                        <Label htmlFor="designation">Designation</Label>
                        <Input id="designation" defaultValue={user?.designation} />
                      </div>
                      <div>
                        <Label htmlFor="institution">Institution</Label>
                        <Input id="institution" defaultValue={user?.institution} />
                      </div>
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" placeholder="Tell us about yourself..." />
                      </div>
                      <Button className="w-full">Save Changes</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">{user?.email || 'john.doe@example.com'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">{user?.institution || 'IIT Mumbai'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">Mumbai, India</span>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-4">
                Passionate researcher and innovator with 10+ years of experience in AI, machine learning, and sustainable technologies. 
                Committed to bridging the gap between research and real-world applications.
              </p>
            </div>
          </div>
        </CardContent>
      </Card> 
    </div>
  );
}