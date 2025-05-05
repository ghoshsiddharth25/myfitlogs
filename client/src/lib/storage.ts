import { HealthData, WeightEntry, WaterEntry, SleepEntry, UserSettings } from "@/types";

const STORAGE_KEY = 'healthtrack_data';

const DEFAULT_SETTINGS: UserSettings = {
  height: 175,
  waterGoal: 2.5,
  sleepGoal: 8,
  weightUnit: 'kg',
  heightUnit: 'cm',
  reminderEnabled: true,
  reminderTime: '07:00',
  darkMode: false
};

const DEFAULT_HEALTH_DATA: HealthData = {
  weights: [],
  waterIntake: [],
  sleepEntries: [],
  settings: DEFAULT_SETTINGS
};

export function saveData(data: HealthData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadData(): HealthData {
  const storedData = localStorage.getItem(STORAGE_KEY);
  if (!storedData) return DEFAULT_HEALTH_DATA;
  
  try {
    const parsedData = JSON.parse(storedData) as HealthData;
    
    // Ensure all required properties exist
    return {
      weights: parsedData.weights || [],
      waterIntake: parsedData.waterIntake || [],
      sleepEntries: parsedData.sleepEntries || [],
      settings: {
        ...DEFAULT_SETTINGS,
        ...parsedData.settings
      }
    };
  } catch (error) {
    console.error('Error parsing stored health data:', error);
    return DEFAULT_HEALTH_DATA;
  }
}

export function saveWeight(entry: WeightEntry): void {
  const data = loadData();
  
  // Check if entry with same id exists
  const existingIndex = data.weights.findIndex(w => w.id === entry.id);
  
  if (existingIndex !== -1) {
    // Update existing entry
    data.weights[existingIndex] = entry;
  } else {
    // Add new entry
    data.weights.push(entry);
  }
  
  // Sort weights by date (newest first)
  data.weights.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  saveData(data);
}

export function saveWaterIntake(entry: WaterEntry): void {
  const data = loadData();
  
  // Check if entry with same id exists
  const existingIndex = data.waterIntake.findIndex(w => w.id === entry.id);
  
  if (existingIndex !== -1) {
    // Update existing entry
    data.waterIntake[existingIndex] = entry;
  } else {
    // Add new entry
    data.waterIntake.push(entry);
  }
  
  // Sort by date and time
  data.waterIntake.sort((a, b) => {
    const dateComparison = new Date(b.date).getTime() - new Date(a.date).getTime();
    if (dateComparison !== 0) return dateComparison;
    return b.time.localeCompare(a.time);
  });
  
  saveData(data);
}

export function saveSleepEntry(entry: SleepEntry): void {
  const data = loadData();
  
  // Check if entry with same id exists
  const existingIndex = data.sleepEntries.findIndex(s => s.id === entry.id);
  
  if (existingIndex !== -1) {
    // Update existing entry
    data.sleepEntries[existingIndex] = entry;
  } else {
    // Add new entry
    data.sleepEntries.push(entry);
  }
  
  // Sort by date (newest first)
  data.sleepEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  saveData(data);
}

export function saveSettings(settings: UserSettings): void {
  const data = loadData();
  data.settings = settings;
  saveData(data);
}

export function deleteWeight(id: string): void {
  const data = loadData();
  data.weights = data.weights.filter(w => w.id !== id);
  saveData(data);
}

export function deleteWaterIntake(id: string): void {
  const data = loadData();
  data.waterIntake = data.waterIntake.filter(w => w.id !== id);
  saveData(data);
}

export function deleteSleepEntry(id: string): void {
  const data = loadData();
  data.sleepEntries = data.sleepEntries.filter(s => s.id !== id);
  saveData(data);
}

export function clearAllData(): void {
  localStorage.removeItem(STORAGE_KEY);
}
