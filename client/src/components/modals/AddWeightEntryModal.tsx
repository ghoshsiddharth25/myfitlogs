import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import { useHealthData } from '@/contexts/HealthDataContext';
import { WeightEntry } from '@/types';
import { generateUniqueId } from '@/lib/utils';

interface AddWeightEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  editEntry?: WeightEntry;
}

export default function AddWeightEntryModal({ 
  isOpen, 
  onClose, 
  editEntry 
}: AddWeightEntryModalProps) {
  const { addWeightEntry, updateWeightEntry } = useHealthData();
  
  const [weight, setWeight] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  
  // Reset form when modal is opened or editing a different entry
  useEffect(() => {
    if (isOpen) {
      if (editEntry) {
        setWeight(editEntry.weight.toString());
        setDate(editEntry.date);
        setNotes(editEntry.notes || '');
      } else {
        // Default to today and empty fields
        setWeight('');
        setDate(new Date().toISOString().split('T')[0]);
        setNotes('');
      }
    }
  }, [isOpen, editEntry]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!weight || !date) return;
    
    const entry: WeightEntry = {
      id: editEntry?.id || generateUniqueId(),
      weight: parseFloat(weight),
      date,
      notes: notes.trim() || undefined
    };
    
    if (editEntry) {
      updateWeightEntry(entry);
    } else {
      addWeightEntry(entry);
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-md mx-4 rounded-lg">
        <DialogHeader className="flex justify-between items-center px-0">
          <DialogTitle className="text-lg font-medium">
            {editEntry ? 'Edit Weight Entry' : 'Add Weight Entry'}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="weight" className="text-muted-foreground text-sm mb-1">Weight (kg)</Label>
            <Input 
              type="number" 
              id="weight" 
              value={weight} 
              onChange={e => setWeight(e.target.value)}
              step="0.1" 
              min="20" 
              max="300" 
              placeholder="Enter weight"
              className="focus:ring-primary focus:border-primary"
              required
            />
          </div>
          
          <div className="mb-4">
            <Label htmlFor="date" className="text-muted-foreground text-sm mb-1">Date</Label>
            <Input 
              type="date" 
              id="date" 
              value={date} 
              onChange={e => setDate(e.target.value)}
              className="focus:ring-primary focus:border-primary"
              required
            />
          </div>
          
          <div className="mb-4">
            <Label htmlFor="notes" className="text-muted-foreground text-sm mb-1">Notes (optional)</Label>
            <Textarea 
              id="notes" 
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
