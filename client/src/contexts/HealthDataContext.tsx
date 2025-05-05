import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { HealthData, WeightEntry, WaterEntry, SleepEntry, UserSettings } from '@/types';
import { scheduleReminder } from '@/lib/notification';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { loadData } from '@/lib/storage'; // As fallback

// Temporary user ID until authentication is implemented
const CURRENT_USER_ID = 1;

interface HealthDataContextProps {
  healthData: HealthData;
  isLoading: boolean;
  addWeightEntry: (entry: Omit<WeightEntry, 'id'>) => void;
  updateWeightEntry: (entry: WeightEntry) => void;
  removeWeightEntry: (id: string) => void;
  addWaterEntry: (entry: Omit<WaterEntry, 'id'>) => void;
  updateWaterEntry: (entry: WaterEntry) => void;
  removeWaterEntry: (id: string) => void;
  addSleepEntry: (entry: Omit<SleepEntry, 'id'>) => void;
  updateSleepEntry: (entry: SleepEntry) => void;
  removeSleepEntry: (id: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  refreshData: () => void;
}

const HealthDataContext = createContext<HealthDataContextProps | undefined>(undefined);

export function HealthDataProvider({ children }: { children: ReactNode }) {
  // Default to local storage data initially
  const [fallbackData] = useState<HealthData>(() => loadData());
  
  // Query for weight entries
  const { data: weightEntries = [], isLoading: isLoadingWeight } = useQuery({
    queryKey: ['/api/users', CURRENT_USER_ID, 'weight-entries'],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/${CURRENT_USER_ID}/weight-entries`);
        if (!res.ok) return [];
        return await res.json();
      } catch (error) {
        console.error('Failed to fetch weight entries:', error);
        return [];
      }
    }
  });
  
  // Query for water entries
  const { data: waterEntries = [], isLoading: isLoadingWater } = useQuery({
    queryKey: ['/api/users', CURRENT_USER_ID, 'water-entries'],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/${CURRENT_USER_ID}/water-entries`);
        if (!res.ok) return [];
        return await res.json();
      } catch (error) {
        console.error('Failed to fetch water entries:', error);
        return [];
      }
    }
  });
  
  // Query for sleep entries
  const { data: sleepEntries = [], isLoading: isLoadingSleep } = useQuery({
    queryKey: ['/api/users', CURRENT_USER_ID, 'sleep-entries'],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/${CURRENT_USER_ID}/sleep-entries`);
        if (!res.ok) return [];
        return await res.json();
      } catch (error) {
        console.error('Failed to fetch sleep entries:', error);
        return [];
      }
    }
  });
  
  // Query for user settings
  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['/api/users', CURRENT_USER_ID, 'settings'],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/${CURRENT_USER_ID}/settings`);
        if (!res.ok) return fallbackData.settings;
        return await res.json();
      } catch (error) {
        console.error('Failed to fetch user settings:', error);
        return fallbackData.settings;
      }
    }
  });
  
  // Combine the data into a health data object
  const healthData: HealthData = {
    weights: weightEntries || fallbackData.weights,
    waterIntake: waterEntries || fallbackData.waterIntake,
    sleepEntries: sleepEntries || fallbackData.sleepEntries,
    settings: settings || fallbackData.settings
  };
  
  const isLoading = isLoadingWeight || isLoadingWater || isLoadingSleep || isLoadingSettings;

  // Schedule reminders when settings change
  useEffect(() => {
    if (settings?.reminderEnabled) {
      scheduleReminder(settings);
    }
  }, [settings]);

  // Weight entry mutations
  const addWeightEntryMutation = useMutation({
    mutationFn: async (entry: Omit<WeightEntry, 'id'>) => {
      return apiRequest('POST', '/api/weight-entries', {
        ...entry,
        userId: CURRENT_USER_ID
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', CURRENT_USER_ID, 'weight-entries'] });
    }
  });

  const updateWeightEntryMutation = useMutation({
    mutationFn: async (entry: WeightEntry) => {
      const { id, ...data } = entry;
      return apiRequest('PUT', `/api/weight-entries/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', CURRENT_USER_ID, 'weight-entries'] });
    }
  });

  const deleteWeightEntryMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/weight-entries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', CURRENT_USER_ID, 'weight-entries'] });
    }
  });

  // Water entry mutations
  const addWaterEntryMutation = useMutation({
    mutationFn: async (entry: Omit<WaterEntry, 'id'>) => {
      return apiRequest('POST', '/api/water-entries', {
        ...entry,
        userId: CURRENT_USER_ID
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', CURRENT_USER_ID, 'water-entries'] });
    }
  });

  const updateWaterEntryMutation = useMutation({
    mutationFn: async (entry: WaterEntry) => {
      const { id, ...data } = entry;
      return apiRequest('PUT', `/api/water-entries/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', CURRENT_USER_ID, 'water-entries'] });
    }
  });

  const deleteWaterEntryMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/water-entries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', CURRENT_USER_ID, 'water-entries'] });
    }
  });

  // Sleep entry mutations
  const addSleepEntryMutation = useMutation({
    mutationFn: async (entry: Omit<SleepEntry, 'id'>) => {
      return apiRequest('POST', '/api/sleep-entries', {
        ...entry,
        userId: CURRENT_USER_ID
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', CURRENT_USER_ID, 'sleep-entries'] });
    }
  });

  const updateSleepEntryMutation = useMutation({
    mutationFn: async (entry: SleepEntry) => {
      const { id, ...data } = entry;
      return apiRequest('PUT', `/api/sleep-entries/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', CURRENT_USER_ID, 'sleep-entries'] });
    }
  });

  const deleteSleepEntryMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest('DELETE', `/api/sleep-entries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', CURRENT_USER_ID, 'sleep-entries'] });
    }
  });

  // Settings mutations
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: Partial<UserSettings>) => {
      try {
        // Try to update first
        await fetch(`/api/users/${CURRENT_USER_ID}/settings`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newSettings)
        });
      } catch (error) {
        // If updating fails, create new settings
        await fetch(`/api/users/${CURRENT_USER_ID}/settings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...fallbackData.settings,
            ...newSettings
          })
        });
      }
      
      // Return updated settings for the reminder scheduling
      return {
        ...fallbackData.settings,
        ...newSettings
      };
    },
    onSuccess: (updatedSettings) => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', CURRENT_USER_ID, 'settings'] });
      
      // Update reminder if needed
      if (updatedSettings.reminderEnabled) {
        scheduleReminder(updatedSettings);
      }
    }
  });

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['/api/users'] });
  };

  // Wrap the mutation functions to provide a simpler interface
  const addWeightEntry = (entry: Omit<WeightEntry, 'id'>) => {
    addWeightEntryMutation.mutate(entry);
  };

  const updateWeightEntry = (entry: WeightEntry) => {
    updateWeightEntryMutation.mutate(entry);
  };

  const removeWeightEntry = (id: string) => {
    deleteWeightEntryMutation.mutate(id);
  };

  const addWaterEntry = (entry: Omit<WaterEntry, 'id'>) => {
    addWaterEntryMutation.mutate(entry);
  };

  const updateWaterEntry = (entry: WaterEntry) => {
    updateWaterEntryMutation.mutate(entry);
  };

  const removeWaterEntry = (id: string) => {
    deleteWaterEntryMutation.mutate(id);
  };

  const addSleepEntry = (entry: Omit<SleepEntry, 'id'>) => {
    addSleepEntryMutation.mutate(entry);
  };

  const updateSleepEntry = (entry: SleepEntry) => {
    updateSleepEntryMutation.mutate(entry);
  };

  const removeSleepEntry = (id: string) => {
    deleteSleepEntryMutation.mutate(id);
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    updateSettingsMutation.mutate(newSettings);
  };

  const value = {
    healthData,
    isLoading,
    addWeightEntry,
    updateWeightEntry,
    removeWeightEntry,
    addWaterEntry,
    updateWaterEntry,
    removeWaterEntry,
    addSleepEntry,
    updateSleepEntry,
    removeSleepEntry,
    updateSettings,
    refreshData
  };

  return (
    <HealthDataContext.Provider value={value}>
      {children}
    </HealthDataContext.Provider>
  );
}

export function useHealthData() {
  const context = useContext(HealthDataContext);
  if (context === undefined) {
    throw new Error('useHealthData must be used within a HealthDataProvider');
  }
  return context;
}
