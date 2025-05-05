import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Moon, Edit } from 'lucide-react';
import { formatShortDate, calculateSleepDuration, formatSleepDuration } from '@/lib/utils';
import { useHealthData } from '@/contexts/HealthDataContext';
import SleepChart from '@/components/charts/SleepChart';

interface SleepLogCardProps {
  onAddEntry: () => void;
  onEditEntry: (id: string) => void;
}

export default function SleepLogCard({ onAddEntry, onEditEntry }: SleepLogCardProps) {
  const { healthData } = useHealthData();
  const { sleepEntries } = healthData;
  
  // Calculate statistics for the last 7 days
  const last7Days = sleepEntries.slice(0, 7);
  
  const sleepDurations = last7Days.map(entry => 
    calculateSleepDuration(entry.bedtime, entry.wakeupTime)
  );
  
  const avgDuration = sleepDurations.length > 0 
    ? sleepDurations.reduce((sum, duration) => sum + duration, 0) / sleepDurations.length 
    : 0;
  
  // Calculate average bedtime and wakeup time
  let avgBedtime = '';
  let avgWakeup = '';
  
  if (last7Days.length > 0) {
    const bedtimeMinutes = last7Days.map(entry => {
      const [hours, minutes] = entry.bedtime.split(':').map(Number);
      return hours * 60 + minutes;
    });
    
    const wakeupMinutes = last7Days.map(entry => {
      const [hours, minutes] = entry.wakeupTime.split(':').map(Number);
      return hours * 60 + minutes;
    });
    
    const avgBedtimeMinutes = Math.floor(
      bedtimeMinutes.reduce((sum, min) => sum + min, 0) / bedtimeMinutes.length
    );
    
    const avgWakeupMinutes = Math.floor(
      wakeupMinutes.reduce((sum, min) => sum + min, 0) / wakeupMinutes.length
    );
    
    const bedHours = Math.floor(avgBedtimeMinutes / 60);
    const bedMins = avgBedtimeMinutes % 60;
    
    const wakeHours = Math.floor(avgWakeupMinutes / 60);
    const wakeMins = avgWakeupMinutes % 60;
    
    avgBedtime = `${bedHours.toString().padStart(2, '0')}:${bedMins.toString().padStart(2, '0')}`;
    avgWakeup = `${wakeHours.toString().padStart(2, '0')}:${wakeMins.toString().padStart(2, '0')}`;
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-foreground">Sleep Log</h2>
          <button 
            className="text-primary text-sm font-medium" 
            onClick={onAddEntry}
          >
            + Add entry
          </button>
        </div>
        
        {sleepEntries.length > 0 ? (
          <>
            <div className="chart-container mb-2">
              <SleepChart entries={sleepEntries.slice(0, 7)} />
            </div>
            
            <div className="grid grid-cols-3 mb-4 text-sm">
              <div>
                <div className="text-muted-foreground">Avg. Duration</div>
                <div className="font-medium">{formatSleepDuration(avgDuration)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Avg. Bedtime</div>
                <div className="font-medium">{formatTime(avgBedtime)}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Avg. Wake-up</div>
                <div className="font-medium">{formatTime(avgWakeup)}</div>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground mb-2">Recent entries</div>
            <div className="space-y-2">
              {sleepEntries.slice(0, 3).map(entry => {
                const duration = calculateSleepDuration(entry.bedtime, entry.wakeupTime);
                return (
                  <div key={entry.id} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <div>
                      <div className="font-medium">{formatSleepDuration(duration)}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatShortDate(entry.date)} · {formatTime(entry.bedtime)} - {formatTime(entry.wakeupTime)}
                      </div>
                    </div>
                    <button 
                      className="text-muted-foreground"
                      onClick={() => onEditEntry(entry.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="py-10 text-center text-muted-foreground">
            <Moon className="h-10 w-10 mx-auto mb-2 text-primary opacity-70" />
            <p>No sleep entries yet.</p>
            <p>Add your first sleep entry to track your sleep patterns.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function formatTime(time: string): string {
  if (!time) return '';
  
  const [hours, minutes] = time.split(':').map(Number);
  return new Date(0, 0, 0, hours, minutes).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}
