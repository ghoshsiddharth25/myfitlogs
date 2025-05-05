import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { WeightEntry, WaterEntry, SleepEntry, BMICategory } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export function formatShortDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  return new Date(0, 0, 0, hours, minutes).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export function calcBMI(weight: number, height: number, heightUnit: 'cm' | 'in' | 'm' = 'cm', weightUnit: 'kg' | 'lb' = 'kg'): number {
  // First convert weight to kg if needed
  let weightInKg = weight;
  if (weightUnit === 'lb') {
    weightInKg = weight / 2.20462;  // lb to kg
  }
  
  // Convert height to meters regardless of input unit
  let heightInMeters;
  if (heightUnit === 'cm') {
    heightInMeters = height / 100;
  } else if (heightUnit === 'in') {
    // Convert inches to meters (1 inch = 0.0254 meters)
    heightInMeters = height * 0.0254;
  } else { // 'm'
    heightInMeters = height; // already in meters
  }
  
  return parseFloat((weightInKg / (heightInMeters * heightInMeters)).toFixed(1));
}

export function getBMICategory(bmi: number): BMICategory {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obesity';
}

export function getBMICategoryColor(category: BMICategory): string {
  switch (category) {
    case 'Underweight': return 'text-blue-500';
    case 'Normal weight': return 'text-success';
    case 'Overweight': return 'text-warning';
    case 'Obesity': return 'text-destructive';
    default: return 'text-muted-foreground';
  }
}

export function getTrendChange(entries: WeightEntry[]): number | null {
  if (entries.length < 2) return null;
  
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  return parseFloat((sortedEntries[0].weight - sortedEntries[1].weight).toFixed(1));
}

export function calculateSleepDuration(bedtime: string, wakeupTime: string): number {
  const [bedHours, bedMinutes] = bedtime.split(':').map(Number);
  const [wakeHours, wakeMinutes] = wakeupTime.split(':').map(Number);
  
  let durationMinutes = (wakeHours * 60 + wakeMinutes) - (bedHours * 60 + bedMinutes);
  
  // If negative, assume sleep crosses midnight
  if (durationMinutes < 0) {
    durationMinutes += 24 * 60;
  }
  
  return durationMinutes;
}

export function formatSleepDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

export function calculateWaterPercentage(current: number, goal: number): number {
  return Math.min(Math.round((current / (goal * 1000)) * 100), 100);
}

// Helper to get data for the last N days
export function getLastNDaysData<T extends { date: string }>(
  data: T[],
  days: number,
  defaultValue: Omit<T, 'date'>
): T[] {
  const result: T[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    
    const existingEntry = data.find(entry => entry.date === dateString);
    
    if (existingEntry) {
      result.push(existingEntry);
    } else {
      result.push({ ...defaultValue, date: dateString } as T);
    }
  }
  
  return result;
}

export function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function convertWeight(weight: number, from: 'kg' | 'lb', to: 'kg' | 'lb'): number {
  if (from === to) return weight;
  
  if (from === 'kg' && to === 'lb') {
    return parseFloat((weight * 2.20462).toFixed(1));  // kg to lb
  } else {
    return parseFloat((weight / 2.20462).toFixed(1));  // lb to kg
  }
}

export function convertHeight(height: number, from: 'cm' | 'in' | 'm', to: 'cm' | 'in' | 'm'): number {
  if (from === to) return height;
  
  // First convert to cm (our base unit)
  let heightInCm = height;
  if (from === 'in') {
    heightInCm = height * 2.54;  // inches to cm
  } else if (from === 'm') {
    heightInCm = height * 100;   // meters to cm
  }
  
  // Then convert from cm to target unit
  if (to === 'cm') {
    return parseFloat(heightInCm.toFixed(1));
  } else if (to === 'in') {
    return parseFloat((heightInCm / 2.54).toFixed(1));  // cm to inches
  } else {
    return parseFloat((heightInCm / 100).toFixed(2));   // cm to meters
  }
}
