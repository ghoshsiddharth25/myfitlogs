import React from 'react';
import { SleepEntry } from '@/types';
import { calculateSleepDuration, formatShortDate } from '@/lib/utils';

interface SleepChartProps {
  entries: SleepEntry[];
}

export default function SleepChart({ entries }: SleepChartProps) {
  // Create a 7-day array starting from today and going backward
  const today = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });
  
  // Map sleep entries to these dates
  const chartData = last7Days.map(date => {
    const entry = entries.find(e => e.date === date);
    return {
      date,
      duration: entry 
        ? calculateSleepDuration(entry.bedtime, entry.wakeupTime) 
        : 0
    };
  });
  
  // Calculate height percentages (8 hours = 100%)
  const targetHours = 8 * 60; // 8 hours in minutes

  return (
    <div className="w-full h-full flex items-end">
      {chartData.map((data, index) => {
        const heightPercentage = Math.min(100, (data.duration / targetHours) * 100);
        
        return (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div 
              className="w-10/12 bg-primary opacity-70 rounded-t-sm"
              style={{ height: `${heightPercentage || 0}%` }}
            ></div>
            <span className="text-xs text-muted-foreground mt-1">
              {formatShortDate(data.date).charAt(0)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
