import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import WeightChart from '@/components/charts/WeightChart';
import { useHealthData } from '@/contexts/HealthDataContext';

export default function WeightTrendsCard() {
  const [period, setPeriod] = useState<'7' | '30' | '90'>('7');
  const { healthData } = useHealthData();
  const { weights } = healthData;
  
  if (weights.length === 0) {
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-foreground">Weight Trends</h2>
            <Select 
              value={period} 
              onValueChange={(value) => setPeriod(value as '7' | '30' | '90')}
            >
              <SelectTrigger className="w-[160px] text-sm border-0 text-muted-foreground focus:ring-0 h-8 p-0">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 3 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="py-10 text-center text-muted-foreground">
            No weight data available. Add your first weight entry to see trends.
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Calculate statistics
  const filteredWeights = weights.filter(w => {
    const date = new Date(w.date);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(period));
    return date >= cutoffDate;
  });
  
  const weightValues = filteredWeights.map(w => w.weight);
  const lowestWeight = Math.min(...weightValues).toFixed(1);
  const highestWeight = Math.max(...weightValues).toFixed(1);
  const averageWeight = (weightValues.reduce((a, b) => a + b, 0) / weightValues.length).toFixed(1);

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-foreground">Weight Trends</h2>
          <Select 
            value={period} 
            onValueChange={(value) => setPeriod(value as '7' | '30' | '90')}
          >
            <SelectTrigger className="w-[160px] text-sm border-0 text-muted-foreground focus:ring-0 h-8 p-0">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
              <SelectItem value="90">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="chart-container mb-2">
          <WeightChart data={filteredWeights} period={parseInt(period)} />
        </div>
        
        <div className="flex justify-between text-sm">
          <div>
            <div className="text-muted-foreground">Lowest</div>
            <div className="font-medium">{lowestWeight} kg</div>
          </div>
          <div>
            <div className="text-muted-foreground">Average</div>
            <div className="font-medium">{averageWeight} kg</div>
          </div>
          <div>
            <div className="text-muted-foreground">Highest</div>
            <div className="font-medium">{highestWeight} kg</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
