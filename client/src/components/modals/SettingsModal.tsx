import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';
import { useHealthData } from '@/contexts/HealthDataContext';
import { requestNotificationPermission } from '@/lib/notification';
import { UserSettings } from '@/types';
import { convertHeight, convertWeight } from '@/lib/utils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { healthData, updateSettings } = useHealthData();
  const { settings } = healthData;
  
  const [formData, setFormData] = useState<UserSettings>({...settings});
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(null);
  
  // Initialize form with current settings
  useEffect(() => {
    if (isOpen) {
      setFormData({...settings});
      
      // Check notification permission
      if ('Notification' in window) {
        setNotificationPermission(Notification.permission);
      }
    }
  }, [isOpen, settings]);
  
  // Handle form input changes
  const handleInputChange = (field: keyof UserSettings, value: number | string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSave = () => {
    updateSettings(formData);
    onClose();
  };
  
  const handleRequestPermission = async () => {
    const permission = await requestNotificationPermission();
    setNotificationPermission(permission);
    
    // Enable reminders if permission was granted
    if (permission === 'granted') {
      setFormData(prev => ({
        ...prev,
        reminderEnabled: true
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-md mx-4 rounded-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="flex justify-between items-center px-0">
          <DialogTitle className="text-lg font-medium">Settings</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div>
          <div className="mb-6">
            <h3 className="font-medium mb-3">Profile</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="settingsHeight" className="text-muted-foreground text-sm mb-1">
                  Height ({formData.heightUnit})
                </Label>
                <Input 
                  type="number" 
                  id="settingsHeight" 
                  value={formData.height} 
                  onChange={e => handleInputChange('height', parseFloat(e.target.value))}
                  min={formData.heightUnit === 'cm' ? 100 : 40} 
                  max={formData.heightUnit === 'cm' ? 250 : 100} 
                  placeholder={formData.heightUnit === 'cm' ? "175" : "69"}
                  className="focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <Label htmlFor="settingsWaterGoal" className="text-muted-foreground text-sm mb-1">
                  Daily water intake goal (L)
                </Label>
                <Input 
                  type="number" 
                  id="settingsWaterGoal" 
                  value={formData.waterGoal} 
                  onChange={e => handleInputChange('waterGoal', parseFloat(e.target.value))}
                  min="0.5" 
                  max="10" 
                  step="0.1" 
                  placeholder="2.5"
                  className="focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <Label htmlFor="settingsSleepGoal" className="text-muted-foreground text-sm mb-1">
                  Daily sleep goal (hours)
                </Label>
                <Input 
                  type="number" 
                  id="settingsSleepGoal" 
                  value={formData.sleepGoal} 
                  onChange={e => handleInputChange('sleepGoal', parseFloat(e.target.value))}
                  min="4" 
                  max="12" 
                  step="0.5" 
                  placeholder="8"
                  className="focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium mb-3">Reminders</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div>Daily reminder</div>
                  <div className="text-muted-foreground text-sm">Receive a daily reminder</div>
                </div>
                {notificationPermission !== 'granted' ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRequestPermission}
                    disabled={notificationPermission === 'denied'}
                  >
                    {notificationPermission === 'denied' 
                      ? 'Permission denied' 
                      : 'Enable notifications'}
                  </Button>
                ) : (
                  <Switch 
                    checked={formData.reminderEnabled} 
                    onCheckedChange={value => handleInputChange('reminderEnabled', value)} 
                  />
                )}
              </div>
              <div>
                <Label htmlFor="reminderTime" className="text-muted-foreground text-sm mb-1">
                  Reminder time
                </Label>
                <Input 
                  type="time" 
                  id="reminderTime" 
                  value={formData.reminderTime} 
                  onChange={e => handleInputChange('reminderTime', e.target.value)}
                  className="focus:ring-primary focus:border-primary"
                  disabled={!formData.reminderEnabled || notificationPermission !== 'granted'}
                />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-medium mb-3">Units</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="weightUnit" className="text-muted-foreground text-sm mb-1">
                  Weight unit
                </Label>
                <Select 
                  value={formData.weightUnit} 
                  onValueChange={value => {
                    const newUnit = value as 'kg' | 'lb';
                    // Only weights need conversion when changing display units
                    setFormData(prev => ({
                      ...prev,
                      weightUnit: newUnit
                    }));
                  }}
                >
                  <SelectTrigger id="weightUnit" className="focus:ring-primary focus:border-primary">
                    <SelectValue placeholder="Select weight unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilograms (kg)</SelectItem>
                    <SelectItem value="lb">Pounds (lb)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="heightUnit" className="text-muted-foreground text-sm mb-1">
                  Height unit
                </Label>
                <Select 
                  value={formData.heightUnit} 
                  onValueChange={value => {
                    const newUnit = value as 'cm' | 'in' | 'm';
                    const convertedHeight = convertHeight(
                      formData.height, 
                      formData.heightUnit as 'cm' | 'in' | 'm', 
                      newUnit
                    );
                    setFormData(prev => ({
                      ...prev,
                      heightUnit: newUnit,
                      height: convertedHeight
                    }));
                  }}
                >
                  <SelectTrigger id="heightUnit" className="focus:ring-primary focus:border-primary">
                    <SelectValue placeholder="Select height unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cm">Centimeters (cm)</SelectItem>
                    <SelectItem value="in">Inches (in)</SelectItem>
                    <SelectItem value="m">Meters (m)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium mb-3">App</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div>Dark mode</div>
                  <div className="text-muted-foreground text-sm">Use dark theme</div>
                </div>
                <Switch 
                  checked={formData.darkMode} 
                  onCheckedChange={value => handleInputChange('darkMode', value)} 
                />
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex justify-end">
            <Button className="bg-primary text-white" onClick={handleSave}>
              Save Settings
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
