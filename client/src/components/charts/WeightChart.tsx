import React from 'react';
import { WeightEntry } from '@/types';
import { formatShortDate, getLastNDaysData } from '@/lib/utils';

interface WeightChartProps {
  data: WeightEntry[];
  period: number;
}

export default function WeightChart({ data, period }: WeightChartProps) {
  // Fill in missing days with null values
  const chartData = getLastNDaysData<WeightEntry>(
    data, 
    Math.min(period, 7), // Show at most 7 days on the chart for clarity
    { id: '', weight: 0 }
  );
  
  // Find min and max weight to scale the chart
  const weights = chartData.map(d => d.weight).filter(w => w > 0);
  const minWeight = weights.length > 0 ? Math.min(...weights) * 0.99 : 0;
  const maxWeight = weights.length > 0 ? Math.max(...weights) * 1.01 : 100;
  const range = maxWeight - minWeight;
  
  return (
    <div className="w-full h-full flex items-end relative">
      {chartData.map((entry, index) => {
        // Skip if weight is 0 (placeholder for missing data)
        if (entry.weight === 0) {
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-10/12 rounded-t-sm" style={{ height: '0%' }}></div>
              <span className="text-xs text-muted-foreground mt-1">
                {formatShortDate(entry.date).charAt(0)}
              </span>
            </div>
          );
        }
        
        // Calculate bar height as percentage
        const heightPercentage = Math.max(
          10, // Minimum height
          ((entry.weight - minWeight) / range) * 100
        );
        
        return (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-10/12 bg-primary rounded-t-sm"
              style={{ height: `${heightPercentage}%` }}
            ></div>
            <span className="text-xs text-muted-foreground mt-1">
              {formatShortDate(entry.date).charAt(0)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
