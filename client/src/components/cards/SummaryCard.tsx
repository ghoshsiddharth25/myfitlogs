import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Scale, Ruler, Droplets, Moon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useHealthData } from '@/contexts/HealthDataContext';
import { formatDate, calcBMI, getBMICategory, calculateSleepDuration, formatSleepDuration, calculateWaterPercentage } from '@/lib/utils';

export default function SummaryCard() {
  const { healthData } = useHealthData();
  const { weights, waterIntake, sleepEntries, settings } = healthData;
  
  // Get today's date in ISO format
  const today = new Date().toISOString().split('T')[0];
  
  // Latest weight
  const latestWeight = weights.length > 0 ? weights[0].weight : null;
  
  // Calculate BMI if we have weight and height
  const bmi = latestWeight && settings.height 
    ? calcBMI(latestWeight, settings.height) 
    : null;
  const bmiCategory = bmi ? getBMICategory(bmi) : null;
  
  // Weekly weight change
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split('T')[0];
  
  const weightFromWeekAgo = weights.find(w => w.date <= weekAgoStr);
  const weeklyWeightChange = weightFromWeekAgo && latestWeight 
    ? latestWeight - weightFromWeekAgo.weight 
    : null;
  
  // Today's water intake
  const todaysWaterIntake = waterIntake
    .filter(w => w.date === today)
    .reduce((total, entry) => total + entry.amount, 0) / 1000; // Convert to liters
  
  const waterPercentage = calculateWaterPercentage(todaysWaterIntake, settings.waterGoal);
  
  // Last night's sleep
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  const lastSleepEntry = sleepEntries.find(s => s.date === yesterdayStr || s.date === today);
  
  let sleepDuration = null;
  let sleepTimes = null;
  
  if (lastSleepEntry) {
    const durationMinutes = calculateSleepDuration(
      lastSleepEntry.bedtime, 
      lastSleepEntry.wakeupTime
    );
    sleepDuration = formatSleepDuration(durationMinutes);
    sleepTimes = `${lastSleepEntry.bedtime.substring(0, 5)} - ${lastSleepEntry.wakeupTime.substring(0, 5)}`;
  }

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-foreground">Today's Summary</h2>
          <span className="text-sm text-muted-foreground">{formatDate(new Date())}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Weight Summary */}
          <div className="bg-background rounded-lg p-3">
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <Scale className="text-primary mr-1 h-4 w-4" />
              Weight
            </div>
            <div className="flex justify-between items-end">
              <span className="text-xl font-medium">
                {latestWeight ? latestWeight.toFixed(1) : '-'}
              </span>
              <span className="text-sm text-muted-foreground">kg</span>
            </div>
            {weeklyWeightChange !== null && (
              <div className="flex items-center mt-1">
                <span className={`text-xs ${weeklyWeightChange <= 0 ? 'text-success' : 'text-destructive'} mr-1`}>
                  {weeklyWeightChange <= 0 ? '▼' : '▲'} {Math.abs(weeklyWeightChange).toFixed(1)} kg
                </span>
                <span className="text-xs text-muted-foreground">this week</span>
              </div>
            )}
          </div>
          
          {/* BMI Summary */}
          <div className="bg-background rounded-lg p-3">
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <Ruler className="text-primary mr-1 h-4 w-4" />
              BMI
            </div>
            <div className="flex justify-between items-end">
              <span className="text-xl font-medium">
                {bmi ? bmi.toFixed(1) : '-'}
              </span>
              {bmiCategory && (
                <span className={`text-sm ${
                  bmiCategory === 'Normal weight' ? 'text-success' : 
                  bmiCategory === 'Underweight' ? 'text-secondary' : 
                  bmiCategory === 'Overweight' ? 'text-warning' : 'text-destructive'
                }`}>
                  {bmiCategory.split(' ')[0]}
                </span>
              )}
            </div>
            <div className="flex items-center mt-1">
              <span className="text-xs text-muted-foreground">
                Height: {settings.height} {settings.heightUnit}
              </span>
            </div>
            {weeklyWeightChange !== null && settings.height && (
              <div className="flex items-center mt-1">
                <span className={`text-xs ${weeklyWeightChange <= 0 ? 'text-success' : 'text-destructive'} mr-1`}>
                  {weeklyWeightChange <= 0 ? '▼' : '▲'} {Math.abs(calcBMI(latestWeight!, settings.height) - calcBMI(latestWeight! + weeklyWeightChange, settings.height)).toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground">this week</span>
              </div>
            )}
          </div>
          
          {/* Water Summary */}
          <div className="bg-background rounded-lg p-3">
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <Droplets className="text-secondary mr-1 h-4 w-4" />
              Water
            </div>
            <div className="flex justify-between items-end">
              <span className="text-xl font-medium">{todaysWaterIntake.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">/ {settings.waterGoal.toFixed(1)} L</span>
            </div>
            <div className="relative mt-2">
              <Progress 
                value={waterPercentage} 
                className="h-1.5 bg-muted"
              >
                <div className="absolute inset-0 h-full bg-secondary rounded-full" style={{ width: `${waterPercentage}%` }}></div>
              </Progress>
              <span className="text-xs text-secondary mt-1 inline-block">{waterPercentage}%</span>
            </div>
          </div>
          
          {/* Sleep Summary */}
          <div className="bg-background rounded-lg p-3">
            <div className="flex items-center text-sm text-muted-foreground mb-1">
              <Moon className="text-primary mr-1 h-4 w-4" />
              Sleep
            </div>
            <div className="flex justify-between items-end">
              <span className="text-xl font-medium">
                {sleepDuration ? sleepDuration.split(' ')[0] : '-'}
              </span>
              <span className="text-sm text-muted-foreground">hrs</span>
            </div>
            {sleepTimes && (
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <span className="material-icons text-xs mr-1">schedule</span>
                {sleepTimes}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
