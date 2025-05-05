export interface WeightEntry {
  id: string;
  weight: number;
  date: string;
  notes?: string;
}

export interface WaterEntry {
  id: string;
  amount: number; // in ml
  date: string;
  time: string;
}

export interface SleepEntry {
  id: string;
  bedtime: string;
  wakeupTime: string;
  date: string;
  quality?: 'excellent' | 'good' | 'fair' | 'poor';
  notes?: string;
}

export interface UserSettings {
  height: number; // in the unit specified by heightUnit
  waterGoal: number; // in L
  sleepGoal: number; // in hours
  weightUnit: 'kg' | 'lb';
  heightUnit: 'cm' | 'in' | 'm';
  reminderEnabled: boolean;
  reminderTime: string; // in format "HH:MM"
  darkMode: boolean;
}

export interface HealthData {
  weights: WeightEntry[];
  waterIntake: WaterEntry[];
  sleepEntries: SleepEntry[];
  settings: UserSettings;
}

export interface WeightChartData {
  date: string;
  weight: number;
}

export interface SleepChartData {
  date: string;
  duration: number; // in minutes
}

export interface WaterChartData {
  date: string;
  amount: number; // in ml
}

export interface BMIRange {
  category: string;
  min: number;
  max: number;
  color: string;
}

export type BMICategory = 'Underweight' | 'Normal weight' | 'Overweight' | 'Obesity';
