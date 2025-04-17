import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { format } from 'date-fns';

const flowIntensities = [
  { label: 'Light', value: 'light', color: '#FFB6C1' },
  { label: 'Medium', value: 'medium', color: '#FF69B4' },
  { label: 'Heavy', value: 'heavy', color: '#FF1493' },
];

export default function LogPeriodScreen() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);

  const handleSave = () => {
    // TODO: Save period data
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>When did your period start?</Text>
      
      <RNCalendar
        style={styles.calendar}
        current={selectedDate}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: {
            selected: true,
            selectedColor: '#FF6B8B',
          },
        }}
        theme={{
          calendarBackground: '#FFF',
          selectedDayBackgroundColor: '#FF6B8B',
          selectedDayTextColor: '#FFF',
          todayTextColor: '#FF6B8B',
          dayTextColor: '#333',
          textDisabledColor: '#D9E1E8',
          monthTextColor: '#333',
          textMonthFontFamily: 'Inter-SemiBold',
          textDayFontFamily: 'Inter-Regular',
          textDayHeaderFontFamily: 'Inter-SemiBold',
        }}
      />

      <View style={styles.flowSection}>
        <Text style={styles.sectionTitle}>Flow Intensity</Text>
        <View style={styles.flowButtons}>
          {flowIntensities.map((flow) => (
            <TouchableOpacity
              key={flow.value}
              style={[
                styles.flowButton,
                selectedFlow === flow.value && { backgroundColor: flow.color },
              ]}
              onPress={() => setSelectedFlow(flow.value)}>
              <Text
                style={[
                  styles.flowButtonText,
                  selectedFlow === flow.value && { color: '#FFF' },
                ]}>
                {flow.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Period</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    margin: 20,
  },
  calendar: {
    marginHorizontal: 20,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  flowSection: {
    margin: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 12,
  },
  flowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  flowButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  flowButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
  saveButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#FF6B8B',
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});