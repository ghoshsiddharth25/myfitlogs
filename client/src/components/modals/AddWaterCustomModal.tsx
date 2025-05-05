import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { useHealthData } from '@/contexts/HealthDataContext';
import { WaterEntry } from '@/types';
import { generateUniqueId } from '@/lib/utils';

interface AddWaterCustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  editEntry?: WaterEntry;
}

export default function AddWaterCustomModal({ 
  isOpen, 
  onClose, 
  editEntry 
}: AddWaterCustomModalProps) {
  const { addWaterEntry, updateWaterEntry } = useHealthData();
  
  const [amount, setAmount] = useState<string>('');
  const [time, setTime] = useState<string>('');
  
  // Reset form when modal is opened or editing a different entry
  useEffect(() => {
    if (isOpen) {
      if (editEntry) {
        setAmount(editEntry.amount.toString());
        setTime(editEntry.time);
      } else {
        // Default to current time and empty amount
        setAmount('');
        const now = new Date();
        setTime(now.toTimeString().substring(0, 5)); // HH:MM format
      }
    }
  }, [isOpen, editEntry]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !time) return;
    
    const today = new Date().toISOString().split('T')[0];
    const entry: WaterEntry = {
      id: editEntry?.id || generateUniqueId(),
      amount: parseInt(amount),
      date: today,
      time
    };
    
    if (editEntry) {
      updateWaterEntry(entry);
    } else {
      addWaterEntry(entry);
    }
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-md mx-4 rounded-lg">
        <DialogHeader className="flex justify-between items-center px-0">
          <DialogTitle className="text-lg font-medium">
            {editEntry ? 'Edit Water Intake' : 'Add Water Intake'}
          </DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="waterAmount" className="text-muted-foreground text-sm mb-1">Amount (mL)</Label>
            <Input 
              type="number" 
              id="waterAmount" 
              value={amount} 
              onChange={e => setAmount(e.target.value)}
              min="10" 
              step="10" 
              placeholder="Enter amount in mL"
              className="focus:ring-secondary focus:border-secondary"
              required
            />
          </div>
          
          <div className="mb-4">
            <Label htmlFor="waterTime" className="text-muted-foreground text-sm mb-1">Time</Label>
            <Input 
              type="time" 
              id="waterTime" 
              value={time} 
              onChange={e => setTime(e.target.value)}
              className="focus:ring-secondary focus:border-secondary"
              required
            />
          </div>
          
          <DialogFooter className="flex justify-end space-x-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-secondary text-white">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
