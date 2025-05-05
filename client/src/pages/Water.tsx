import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Droplets, Trash2 } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import WaterIntakeCard from '@/components/cards/WaterIntakeCard';
import AddWaterCustomModal from '@/components/modals/AddWaterCustomModal';
import { useHealthData } from '@/contexts/HealthDataContext';
import { formatDate, formatTime } from '@/lib/utils';

export default function Water() {
  const { healthData, removeWaterEntry } = useHealthData();
  const { waterIntake } = healthData;
  
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filter water intake entries based on selected period
  const filteredEntries = waterIntake.filter(entry => {
    const entryDate = new Date(entry.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (period === 'today') {
      return entryDate.toISOString().split('T')[0] === today.toISOString().split('T')[0];
    } else if (period === 'week') {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    } else { // month
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return entryDate >= monthAgo;
    }
  });
  
  // Group entries by date
  const entriesByDate = filteredEntries.reduce<Record<string, typeof filteredEntries>>((acc, entry) => {
    if (!acc[entry.date]) {
      acc[entry.date] = [];
    }
    acc[entry.date].push(entry);
    return acc;
  }, {});
  
  // Sort dates in descending order
  const sortedDates = Object.keys(entriesByDate).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });
  
  const handleDeleteEntry = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      removeWaterEntry(id);
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <WaterIntakeCard onOpenCustomModal={() => setIsModalOpen(true)} />
      
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-foreground">Water Intake History</h2>
            <Select 
              value={period} 
              onValueChange={(value) => setPeriod(value as 'today' | 'week' | 'month')}
            >
              <SelectTrigger className="w-[160px] text-sm h-8">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {sortedDates.length > 0 ? (
            <div className="overflow-x-auto">
              {sortedDates.map(date => {
                const entries = entriesByDate[date];
                const totalAmount = entries.reduce((sum, entry) => sum + entry.amount, 0);
                
                return (
                  <div key={date} className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">{formatDate(new Date(date))}</h3>
                      <span className="text-sm text-muted-foreground">
                        Total: {(totalAmount / 1000).toFixed(1)} L
                      </span>
                    </div>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Time</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {entries.map(entry => (
                          <TableRow key={entry.id}>
                            <TableCell>{formatTime(entry.time)}</TableCell>
                            <TableCell>{entry.amount} ml</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteEntry(entry.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-10 text-center text-muted-foreground">
              <Droplets className="h-10 w-10 mx-auto mb-2 text-secondary opacity-70" />
              <p>No water intake entries found for the selected period.</p>
              <Button 
                className="mt-4 bg-secondary text-white"
                onClick={() => setIsModalOpen(true)}
              >
                Add Water Intake
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <AddWaterCustomModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
