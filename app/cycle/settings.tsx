import { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Bell, Clock, Calendar, Volume2, ChevronRight } from 'lucide-react-native';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';

// Sound options for notifications
const NOTIFICATION_SOUNDS = {
  gentle: 'GentleBell.mp3',
  chime: 'ChimeBreeze.mp3',
  none: null,
};

export default function CycleSettingsScreen() {
  const [notifications, setNotifications] = useState({
    periodReminder: true,
    ovulationReminder: true,
    logReminder: true,
  });

  const [notificationTimes, setNotificationTimes] = useState({
    periodReminder: '09:00',
    ovulationReminder: '09:00',
    logReminder: '09:00',
  });

  const [notificationSounds, setNotificationSounds] = useState({
    periodReminder: NOTIFICATION_SOUNDS.gentle,
    ovulationReminder: NOTIFICATION_SOUNDS.chime,
    logReminder: NOTIFICATION_SOUNDS.gentle,
  });

  const toggleSwitch = async (key: keyof typeof notifications) => {
    try {
      if (!notifications[key]) {
        // Request permission when enabling notifications
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          alert('Please enable notifications in your device settings to receive reminders.');
          return;
        }
      }

      setNotifications(prev => ({
        ...prev,
        [key]: !prev[key],
      }));

      // Schedule or cancel notifications based on the new state
      if (!notifications[key]) {
        await scheduleNotification(key);
      } else {
        await cancelNotification(key);
      }
    } catch (error) {
      console.error('Error toggling notification:', error);
      alert('Failed to update notification settings. Please try again.');
    }
  };

  const scheduleNotification = async (type: keyof typeof notifications) => {
    if (Platform.OS === 'web') {
      console.log('Notifications not supported on web platform');
      return;
    }

    try {
      let trigger;
      let title;
      let body;

      switch (type) {
        case 'periodReminder':
          // Schedule 2 days before predicted period
          trigger = {
            seconds: 172800, // 2 days
            repeats: true
          };
          title = "Period Reminder";
          body = "Your period may start in 2 days";
          break;

        case 'ovulationReminder':
          // Schedule on predicted ovulation day
          trigger = {
            seconds: 86400, // 1 day
            repeats: true
          };
          title = "Ovulation Day";
          body = "Today is your predicted ovulation day";
          break;

        case 'logReminder':
          // Schedule daily reminder
          const [hours, minutes] = notificationTimes[type].split(':');
          trigger = {
            hour: parseInt(hours, 10),
            minute: parseInt(minutes, 10),
            repeats: true
          };
          title = "Daily Log Reminder";
          body = "Remember to track your symptoms today";
          break;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: notificationSounds[type] || true,
        },
        trigger,
      });
    } catch (error) {
      console.error('Error scheduling notification:', error);
      throw error;
    }
  };

  const cancelNotification = async (type: keyof typeof notifications) => {
    if (Platform.OS === 'web') return;
    
    try {
      // Cancel all notifications of this type
      await Notifications.cancelScheduledNotificationAsync(type);
    } catch (error) {
      console.error('Error canceling notification:', error);
      throw error;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Bell size={24} color="#FF6B8B" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Period Reminders</Text>
              <Text style={styles.settingDescription}>
                Get notified 2 days before your predicted period
              </Text>
            </View>
          </View>
          <Switch
            value={notifications.periodReminder}
            onValueChange={() => toggleSwitch('periodReminder')}
            trackColor={{ false: '#D9D9D9', true: '#FFB6C1' }}
            thumbColor={notifications.periodReminder ? '#FF6B8B' : '#F4F4F4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Calendar size={24} color="#FF6B8B" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Ovulation Alerts</Text>
              <Text style={styles.settingDescription}>
                Get notified on your predicted ovulation day
              </Text>
            </View>
          </View>
          <Switch
            value={notifications.ovulationReminder}
            onValueChange={() => toggleSwitch('ovulationReminder')}
            trackColor={{ false: '#D9D9D9', true: '#FFB6C1' }}
            thumbColor={notifications.ovulationReminder ? '#FF6B8B' : '#F4F4F4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View style={styles.settingInfo}>
            <Clock size={24} color="#FF6B8B" />
            <View style={styles.settingText}>
              <Text style={styles.settingTitle}>Daily Log Reminder</Text>
              <Text style={styles.settingDescription}>
                Reminder to track your symptoms daily at {notificationTimes.logReminder}
              </Text>
            </View>
          </View>
          <Switch
            value={notifications.logReminder}
            onValueChange={() => toggleSwitch('logReminder')}
            trackColor={{ false: '#D9D9D9', true: '#FFB6C1' }}
            thumbColor={notifications.logReminder ? '#FF6B8B' : '#F4F4F4'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sound Settings</Text>
        {Object.entries(notifications).map(([key, enabled]) => (
          enabled && (
            <TouchableOpacity 
              key={key} 
              style={styles.soundItem}
              onPress={() => {
                // TODO: Implement sound picker
                console.log('Open sound picker for:', key);
              }}>
              <View style={styles.settingInfo}>
                <Volume2 size={24} color="#FF6B8B" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>
                    {key === 'periodReminder' ? 'Period Alert Sound' :
                     key === 'ovulationReminder' ? 'Ovulation Alert Sound' :
                     'Daily Reminder Sound'}
                  </Text>
                  <Text style={styles.settingDescription}>
                    {notificationSounds[key as keyof typeof notificationSounds] || 'Default Sound'}
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color="#666" />
            </TouchableOpacity>
          )
        ))}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoText}>
          Notifications will be sent at appropriate times based on your cycle data and preferences.
          {Platform.OS === 'web' && '\nNote: Notifications are not supported in web browsers.'}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  soundItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 2,
  },
  infoSection: {
    padding: 20,
    backgroundColor: '#FFF5F7',
    margin: 20,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    lineHeight: 20,
  },
});