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
  Plus, 
  Calendar, 
  Users, 
  TrendingUp, 
  Building, 
  MapPin,
  ExternalLink,
  Edit,
  Trash2,
  Rocket,
  Target,
  DollarSign
} from 'lucide-react';

export default function StartupPage() {

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Startups</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage and track your startup ventures and roles</p>
      </div>
    </div>
  );
}