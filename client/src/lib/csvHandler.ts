import { saveAs } from 'file-saver';
import Papa from 'papaparse';
import { HealthData, WeightEntry, WaterEntry, SleepEntry, UserSettings } from "@/types";
import { loadData, saveData } from "./storage";

// Export data to CSV files
export function exportAllData(): void {
  const data = loadData();
  
  // Export weights
  const weightsCSV = Papa.unparse(data.weights);
  const weightsBlob = new Blob([weightsCSV], { type: 'text/csv;charset=utf-8' });
  saveAs(weightsBlob, 'healthtrack_weights.csv');
  
  // Export water intake
  const waterCSV = Papa.unparse(data.waterIntake);
  const waterBlob = new Blob([waterCSV], { type: 'text/csv;charset=utf-8' });
  saveAs(waterBlob, 'healthtrack_water.csv');
  
  // Export sleep entries
  const sleepCSV = Papa.unparse(data.sleepEntries);
  const sleepBlob = new Blob([sleepCSV], { type: 'text/csv;charset=utf-8' });
  saveAs(sleepBlob, 'healthtrack_sleep.csv');
  
  // Export settings
  const settingsCSV = Papa.unparse([data.settings]);
  const settingsBlob = new Blob([settingsCSV], { type: 'text/csv;charset=utf-8' });
  saveAs(settingsBlob, 'healthtrack_settings.csv');
}

// Import data from a single CSV file
export function importData(file: File): Promise<{ success: boolean, message: string }> {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          const filename = file.name.toLowerCase();
          const data = loadData();
          
          if (filename.includes('weight')) {
            // Import weights
            data.weights = results.data as WeightEntry[];
            saveData(data);
            resolve({ success: true, message: 'Weight data imported successfully' });
          } else if (filename.includes('water')) {
            // Import water intake
            data.waterIntake = results.data as WaterEntry[];
            saveData(data);
            resolve({ success: true, message: 'Water intake data imported successfully' });
          } else if (filename.includes('sleep')) {
            // Import sleep entries
            data.sleepEntries = results.data as SleepEntry[];
            saveData(data);
            resolve({ success: true, message: 'Sleep data imported successfully' });
          } else if (filename.includes('settings')) {
            // Import settings
            if (results.data.length > 0) {
              data.settings = results.data[0] as UserSettings;
              saveData(data);
              resolve({ success: true, message: 'Settings imported successfully' });
            } else {
              resolve({ success: false, message: 'Settings file is empty' });
            }
          } else {
            resolve({ success: false, message: 'Unknown file type. Please use exported files from HealthTrack.' });
          }
        } catch (error) {
          console.error('Error importing data:', error);
          resolve({ success: false, message: 'Failed to import data. Please check the file format.' });
        }
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        resolve({ success: false, message: 'Failed to parse CSV file: ' + error.message });
      }
    });
  });
}
