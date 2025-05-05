import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { useHealthData } from '@/contexts/HealthDataContext';
import { SleepEntry } from '@/types';
import { generateUniqueId } from '@/lib/utils';

interface AddSleepEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  editEntry?: SleepEntry;
}

export default function AddSleepEntryModal({ 
  isOpen, 
  onClose, 
  editEntry 
}: AddSleepEntryModalProps) {
  const { addSleepEntry, updateSleepEntry } = useHealthData();
  
  const [bedtime, setBedtime] = useState<string>('');
  const [wakeupTime, setWakeupTime] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [quality, setQuality] = useState<'excellent' | 'good' | 'fair' | 'poor'>('good');
  const [notes, setNotes] = useState<string>('');
  
  // Reset form when modal is opened or editing a different entry
  useEffect(() => {
    if (isOpen) {
      if (editEntry) {
        setBedtime(editEntry.bedtime);
        setWakeupTime(editEntry.wakeupTime);
        setDate(editEntry.date);
        setQuality(editEntry.quality || 'good');
        setNotes(editEntry.notes || '');
      } else {
        // Default to today and empty fields
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        setBedtime('22:00');
        setWakeupTime('06:00');
        setDate(yesterdayStr);
        setQuality('good');
        setNotes('');
      }
    }
  }, [isOpen, editEntry]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bedtime || !wakeupTime || !date) return;
    
    const entry: SleepEntry = {
      id: editEntry?.id || generateUniqueId(),
      bedtime,
      wakeupTime,
      date,
      quality,
      notes: notes.trim() || undefined
    };
    
    if (editEntry) {
      updateSleepEntry(entry);
    } else {
      addSleepEntry(entry);
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-md mx-4 rounded-lg">
        <DialogHeader className="flex justify-between items-center px-0">
          <DialogTitle className="text-lg font-medium">
            {editEntry ? 'Edit Sleep Entry' : 'Add Sleep Entry'}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="bedtime" className="text-muted-foreground text-sm mb-1">Bedtime</Label>
              <Input 
                type="time" 
                id="bedtime" 
                value={bedtime} 
                onChange={e => setBedtime(e.target.value)}
                className="focus:ring-primary focus:border-primary"
                required
              />
            </div>
            <div>
              <Label htmlFor="wakeup" className="text-muted-foreground text-sm mb-1">Wake-up time</Label>
              <Input 
                type="time" 
                id="wakeup" 
                value={wakeupTime} 
                onChange={e => setWakeupTime(e.target.value)}
                className="focus:ring-primary focus:border-primary"
                required
              />
            </div>
          </div>
          
          <div className="mb-4">
            <Label htmlFor="sleepDate" className="text-muted-foreground text-sm mb-1">Date</Label>
            <Input 
              type="date" 
              id="sleepDate" 
              value={date} 
              onChange={e => setDate(e.target.value)}
              className="focus:ring-primary focus:border-primary"
              required
            />
          </div>
          
          <div className="mb-4">
            <Label htmlFor="sleepQuality" className="text-muted-foreground text-sm mb-1">Sleep Quality</Label>
            <Select value={quality} onValueChange={(value) => setQuality(value as any)}>
              <SelectTrigger className="focus:ring-primary focus:border-primary">
                <SelectValue placeholder="Select quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="mb-4">
            <Label htmlFor="sleepNotes" className="text-muted-foreground text-sm mb-1">Notes (optional)</Label>
            <Textarea 
              id="sleepNotes" 
              value={notes} 
              onChange={e => setNotes(e.target.value)}
              className="focus:ring-primary focus:border-primary" 
              rows={2} 
              placeholder="Add notes"
            />
          </div>
          
          <DialogFooter className="flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-primary text-white">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
