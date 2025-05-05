import { UserSettings } from "@/types";

// Check if browser supports notifications
export function isNotificationSupported(): boolean {
  return 'Notification' in window;
}

// Request permission for notifications
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    return 'denied';
  }
  
  return await Notification.requestPermission();
}

// Initialize notifications and return current permission
export async function initializeNotifications(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) {
    return 'denied';
  }
  
  return Notification.permission;
}

// Show a notification
export function showNotification(title: string, options?: NotificationOptions): void {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return;
  }
  
  new Notification(title, options);
}

// Schedule daily reminder based on settings
export function scheduleReminder(settings: UserSettings): void {
  if (!settings.reminderEnabled || !isNotificationSupported() || Notification.permission !== 'granted') {
    return;
  }
  
  const now = new Date();
  const [hours, minutes] = settings.reminderTime.split(':').map(Number);
  
  // Set reminder time for today
  const reminderTime = new Date(now);
  reminderTime.setHours(hours, minutes, 0, 0);
  
  // If reminder time has already passed today, schedule for tomorrow
  if (reminderTime < now) {
    reminderTime.setDate(reminderTime.getDate() + 1);
  }
  
  // Calculate ms until reminder time
  const msUntilReminder = reminderTime.getTime() - now.getTime();
  
  // Schedule reminder
  setTimeout(() => {
    showNotification('HealthTrack Reminder', {
      body: 'Remember to log your health data for today!',
      icon: '/icon.png'
    });
    
    // Schedule next reminder for tomorrow
    const nextReminder = new Date(reminderTime);
    nextReminder.setDate(nextReminder.getDate() + 1);
    
    // Recursively schedule next reminder
    scheduleReminder(settings);
    
  }, msUntilReminder);
}
