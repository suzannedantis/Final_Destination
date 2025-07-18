'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FlaskConical } from 'lucide-react';

interface AddIPRFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: IPRFormData) => void;
}

export interface IPRFormData {
  title: string;
  type: string;
  description: string;
  startDate: string;
}

export default function AddIPRForm({ isOpen, onClose, onSubmit }: AddIPRFormProps) {
  const [formData, setFormData] = useState<IPRFormData>({
    title: '',
    type: '',
    description: '',
    startDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ title: '', type: '', description: '', startDate: '' });
    onClose();
  };

  const handleInputChange = (field: keyof IPRFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FlaskConical className="w-5 h-5" />
            <span>Add New IPR Filing</span>
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="ipr-title">Title of the Patent/IPR *</Label>
            <Input
              id="ipr-title"
              placeholder="Enter IPR title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="ipr-type">Type of IPR *</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select IPR type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Patent">Patent</SelectItem>
                <SelectItem value="Trademark">Trademark</SelectItem>
                <SelectItem value="Copyright">Copyright</SelectItem>
                <SelectItem value="Design">Industrial Design</SelectItem>
                <SelectItem value="Trade Secret">Trade Secret</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="ipr-description">Description</Label>
            <Textarea
              id="ipr-description"
              placeholder="Brief description of your IPR"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="ipr-start-date">Start Date</Label>
            <Input
              id="ipr-start-date"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add IPR Filing</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}