import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Droplets, Plus, Trash2 } from 'lucide-react';
import { formatDate, formatTime } from '@/lib/utils';
import { useHealthData } from '@/contexts/HealthDataContext';

interface WaterButtonProps {
  amount?: number;
  onClick: () => void;
  isCustom?: boolean;
}

function WaterButton({ amount, onClick, isCustom = false }: WaterButtonProps) {
  return (
    <button 
      className="flex items-center justify-center bg-blue-100 text-blue-700 rounded-full w-16 h-16 shadow-sm hover:bg-blue-200 transition-colors"
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        {isCustom ? (
          <>
            <Plus className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-semibold mt-1">Custom</span>
          </>
        ) : (
          <>
            <Droplets className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-semibold mt-1">{amount} mL</span>
          </>
        )}
      </div>
    </button>
  );
}

interface WaterEntryItemProps {
  amount: number;
  time: string;
  onDelete: () => void;
}

function WaterEntryItem({ amount, time, onDelete }: WaterEntryItemProps) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
      <div className="flex items-center">
        <Droplets className="text-blue-500 mr-2 h-4 w-4" />
        <span className="font-medium">{amount} mL</span>
      </div>
      <div className="flex items-center">
        <span className="text-muted-foreground mr-3">{formatTime(time)}</span>
        <button className="text-muted-foreground" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

interface WaterIntakeCardProps {
  onOpenCustomModal: () => void;
}

export default function WaterIntakeCard({ onOpenCustomModal }: WaterIntakeCardProps) {
  const { healthData, addWaterEntry, removeWaterEntry } = useHealthData();
  const { waterIntake, settings } = healthData;
  
  // Get today's date in ISO format
  const today = new Date().toISOString().split('T')[0];
  
  // Today's water intake
  const todaysWaterIntake = waterIntake
    .filter(w => w.date === today)
    .reduce((total, entry) => total + entry.amount, 0) / 1000; // Convert to liters
  
  // Filtered water entries for today
  const todaysEntries = waterIntake.filter(w => w.date === today);
  
  // Calculate percentage
  const percentage = Math.min(Math.round((todaysWaterIntake / settings.waterGoal) * 100), 100);

  // Quick add water entry
  const handleQuickAdd = (amount: number) => {
    const now = new Date();
    const time = now.toTimeString().substring(0, 5); // HH:MM format
    
    addWaterEntry({
      amount,
      date: today,
      time
    });
  };

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-foreground">Water Intake</h2>
          <span className="text-sm text-muted-foreground">{formatDate(new Date())}</span>
        </div>
        
        <div className="flex items-center justify-center mb-4">
          <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path 
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                fill="none" 
                stroke="#E5E7EB" 
                strokeWidth="3" 
              />
              <path 
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                fill="none" 
                stroke="#2196F3" 
                strokeWidth="3" 
                strokeDasharray={`${percentage}, 100`} 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-medium">{percentage}%</span>
              <span className="text-base text-muted-foreground mt-1">
                {todaysWaterIntake.toFixed(1)} / {settings.waterGoal.toFixed(1)} L
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-4 mb-6 mt-2">
          <WaterButton amount={100} onClick={() => handleQuickAdd(100)} />
          <WaterButton amount={200} onClick={() => handleQuickAdd(200)} />
          <WaterButton amount={300} onClick={() => handleQuickAdd(300)} />
          <WaterButton isCustom onClick={onOpenCustomModal} />
        </div>
        
        {todaysEntries.length > 0 ? (
          <>
            <div className="text-sm text-muted-foreground mb-2">Today's log</div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {todaysEntries.map(entry => (
                <WaterEntryItem 
                  key={entry.id}
                  amount={entry.amount} 
                  time={entry.time} 
                  onDelete={() => removeWaterEntry(entry.id)} 
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center text-muted-foreground py-4">
            No water intake logged today. Use the buttons above to add entries.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
