import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Moon, Trash2, Edit } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import SleepLogCard from '@/components/cards/SleepLogCard';
import AddSleepEntryModal from '@/components/modals/AddSleepEntryModal';
import { useHealthData } from '@/contexts/HealthDataContext';
import { SleepEntry } from '@/types';
import { formatDate, formatTime, calculateSleepDuration, formatSleepDuration } from '@/lib/utils';

export default function Sleep() {
  const { healthData, removeSleepEntry } = useHealthData();
  const { sleepEntries } = healthData;
  
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('month');
  const [editingEntry, setEditingEntry] = useState<SleepEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter sleep entries based on selected period
  const filteredEntries = sleepEntries.filter(entry => {
    const entryDate = new Date(entry.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (period === 'week') {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    } else if (period === 'month') {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return entryDate >= monthAgo;
    } else {
      return true; // 'all' period
    }
  });
  
  const handleAddSleep = () => {
    setEditingEntry(null);
    setIsModalOpen(true);
  };
  
  const handleEditSleep = (entry: SleepEntry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };
  
  const handleDeleteSleep = (id: string) => {
    if (window.confirm('Are you sure you want to delete this sleep entry?')) {
      removeSleepEntry(id);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <SleepLogCard 
        onAddEntry={handleAddSleep} 
        onEditEntry={(id) => {
          const entry = sleepEntries.find(e => e.id === id);
          if (entry) {
            handleEditSleep(entry);
          }
        }} 
      />
      
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-foreground">Sleep History</h2>
            <Select 
              value={period} 
              onValueChange={(value) => setPeriod(value as 'week' | 'month' | 'all')}
            >
              <SelectTrigger className="w-[160px] text-sm h-8">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
                <SelectItem value="all">All Entries</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {filteredEntries.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Bedtime</TableHead>
                    <TableHead>Wake-up</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Quality</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEntries.map(entry => {
                    const duration = calculateSleepDuration(entry.bedtime, entry.wakeupTime);
                    
                    return (
                      <TableRow key={entry.id}>
                        <TableCell>{formatDate(new Date(entry.date))}</TableCell>
                        <TableCell>{formatTime(entry.bedtime)}</TableCell>
                        <TableCell>{formatTime(entry.wakeupTime)}</TableCell>
                        <TableCell>{formatSleepDuration(duration)}</TableCell>
                        <TableCell className="capitalize">{entry.quality || 'Not rated'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditSleep(entry)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteSleep(entry.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="py-10 text-center text-muted-foreground">
              <Moon className="h-10 w-10 mx-auto mb-2 text-primary opacity-70" />
              <p>No sleep entries found for the selected period.</p>
              <Button 
                className="mt-4 bg-primary text-white"
                onClick={handleAddSleep}
              >
                Add Sleep Entry
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <AddSleepEntryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editEntry={editingEntry || undefined}
      />
    </div>
  );
}
