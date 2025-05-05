import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2, LineChart } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import AddWeightEntryModal from '@/components/modals/AddWeightEntryModal';
import WeightChart from '@/components/charts/WeightChart';
import { useHealthData } from '@/contexts/HealthDataContext';
import { WeightEntry } from '@/types';
import { formatDate } from '@/lib/utils';

export default function Weight() {
  const { healthData, removeWeightEntry } = useHealthData();
  const { weights } = healthData;
  
  const [period, setPeriod] = useState<'7' | '30' | '90'>('30');
  const [editingEntry, setEditingEntry] = useState<WeightEntry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleAddWeight = () => {
    setEditingEntry(null);
    setIsModalOpen(true);
  };
  
  const handleEditWeight = (entry: WeightEntry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };
  
  const handleDeleteWeight = (id: string) => {
    if (window.confirm('Are you sure you want to delete this weight entry?')) {
      removeWeightEntry(id);
    }
  };
  
  // Filter weights based on selected period
  const filteredWeights = weights.filter(w => {
    const date = new Date(w.date);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(period));
    return date >= cutoffDate;
  });
  
  return (
    <div className="container mx-auto px-4 py-4">
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-foreground">Weight History</h2>
            <Select 
              value={period} 
              onValueChange={(value) => setPeriod(value as '7' | '30' | '90')}
            >
              <SelectTrigger className="w-[160px] text-sm h-8">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {weights.length > 0 ? (
            <>
              <div className="chart-container mb-6">
                <WeightChart data={filteredWeights} period={parseInt(period)} />
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Weight (kg)</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredWeights.map(entry => (
                      <TableRow key={entry.id}>
                        <TableCell>{formatDate(new Date(entry.date))}</TableCell>
                        <TableCell>{entry.weight.toFixed(1)}</TableCell>
                        <TableCell className="max-w-xs truncate">{entry.notes || '-'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleEditWeight(entry)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleDeleteWeight(entry.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <div className="py-10 text-center text-muted-foreground">
              <LineChart className="h-10 w-10 mx-auto mb-2 text-primary opacity-70" />
              <p>No weight entries yet.</p>
              <p>Add your first weight entry to start tracking your progress.</p>
              <Button 
                className="mt-4 bg-primary text-white"
                onClick={handleAddWeight}
              >
                Add Weight Entry
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <AddWeightEntryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editEntry={editingEntry || undefined}
      />
    </div>
  );
}
