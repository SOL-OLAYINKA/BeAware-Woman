import { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { Bell, Clock, Calendar } from 'lucide-react-native';

export default function CycleSettingsScreen() {
  const [notifications, setNotifications] = useState({
    periodReminder: true,
    ovulationReminder: true,
    logReminder: true,
  });

  const toggleSwitch = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
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
                Reminder to track your symptoms daily
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

      <View style={styles.infoSection}>
        <Text style={styles.infoText}>
          Notifications will be sent at appropriate times based on your cycle data and preferences.
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