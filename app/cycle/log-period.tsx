import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { router } from 'expo-router';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { format, addDays } from 'date-fns';
import { Calendar, Droplets, ArrowRight } from 'lucide-react-native';

const flowIntensities = [
  { label: 'Light', value: 'light', color: '#FFB6C1' },
  { label: 'Medium', value: 'medium', color: '#FF69B4' },
  { label: 'Heavy', value: 'heavy', color: '#FF1493' },
];

export default function LogPeriodScreen() {
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(addDays(new Date(), 5), 'yyyy-MM-dd'));
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  const [isOvulation, setIsOvulation] = useState(false);
  const [datePickerView, setDatePickerView] = useState<'start' | 'end'>('start');

  const handleSave = () => {
    // TODO: Save period/ovulation data
    const data = {
      startDate,
      endDate,
      flowIntensity: selectedFlow,
      isOvulation,
    };
    console.log('Saving data:', data);
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {isOvulation ? 'Log Ovulation Date' : 'Log Period Details'}
        </Text>
        <Text style={styles.subtitle}>
          {isOvulation 
            ? 'Track your ovulation to better understand your cycle'
            : 'Keep track of your menstrual cycle for better predictions'}
        </Text>
      </View>

      <View style={styles.typeSwitch}>
        <Text style={styles.switchLabel}>Log Ovulation Instead?</Text>
        <Switch
          value={isOvulation}
          onValueChange={setIsOvulation}
          trackColor={{ false: '#FFB6C1', true: '#90CAF9' }}
          thumbColor={isOvulation ? '#2196F3' : '#FF6B8B'}
        />
      </View>

      {!isOvulation && (
        <View style={styles.dateSection}>
          <TouchableOpacity 
            style={[styles.datePicker, datePickerView === 'start' && styles.activeDate]}
            onPress={() => setDatePickerView('start')}>
            <Calendar size={20} color={datePickerView === 'start' ? '#FF6B8B' : '#666'} />
            <View style={styles.dateTextContainer}>
              <Text style={styles.dateLabel}>Start Date</Text>
              <Text style={styles.dateValue}>{format(new Date(startDate), 'MMM d, yyyy')}</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.dateArrow}>
            <ArrowRight size={20} color="#666" />
          </View>

          <TouchableOpacity 
            style={[styles.datePicker, datePickerView === 'end' && styles.activeDate]}
            onPress={() => setDatePickerView('end')}>
            <Calendar size={20} color={datePickerView === 'end' ? '#FF6B8B' : '#666'} />
            <View style={styles.dateTextContainer}>
              <Text style={styles.dateLabel}>End Date</Text>
              <Text style={styles.dateValue}>{format(new Date(endDate), 'MMM d, yyyy')}</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      
      <RNCalendar
        style={styles.calendar}
        current={datePickerView === 'start' ? startDate : endDate}
        onDayPress={(day) => {
          if (isOvulation) {
            setStartDate(day.dateString);
            setEndDate(day.dateString);
          } else if (datePickerView === 'start') {
            setStartDate(day.dateString);
            if (new Date(day.dateString) > new Date(endDate)) {
              setEndDate(day.dateString);
            }
          } else {
            if (new Date(day.dateString) >= new Date(startDate)) {
              setEndDate(day.dateString);
            }
          }
        }}
        markedDates={{
          [startDate]: {
            startingDay: true,
            selected: true,
            selectedColor: isOvulation ? '#2196F3' : '#FF6B8B',
          },
          [endDate]: {
            endingDay: true,
            selected: true,
            selectedColor: isOvulation ? '#2196F3' : '#FF6B8B',
          },
        }}
        theme={{
          calendarBackground: '#FFF',
          selectedDayBackgroundColor: isOvulation ? '#2196F3' : '#FF6B8B',
          selectedDayTextColor: '#FFF',
          todayTextColor: isOvulation ? '#2196F3' : '#FF6B8B',
          dayTextColor: '#333',
          textDisabledColor: '#D9E1E8',
          monthTextColor: '#333',
          textMonthFontFamily: 'Inter-SemiBold',
          textDayFontFamily: 'Inter-Regular',
          textDayHeaderFontFamily: 'Inter-SemiBold',
        }}
      />

      {!isOvulation && (
        <View style={styles.flowSection}>
          <View style={styles.sectionHeader}>
            <Droplets size={20} color="#FF6B8B" />
            <Text style={styles.sectionTitle}>Flow Intensity</Text>
          </View>
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
      )}

      <TouchableOpacity 
        style={[styles.saveButton, isOvulation && styles.ovulationButton]} 
        onPress={handleSave}>
        <Text style={styles.saveButtonText}>
          {isOvulation ? 'Save Ovulation Date' : 'Save Period Details'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  typeSwitch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#F8F8F8',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
  },
  switchLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
  },
  dateSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  datePicker: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeDate: {
    borderColor: '#FF6B8B',
    backgroundColor: '#FFF',
  },
  dateTextContainer: {
    marginLeft: 8,
  },
  dateLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  dateValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginTop: 2,
  },
  dateArrow: {
    paddingHorizontal: 8,
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginLeft: 8,
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
  ovulationButton: {
    backgroundColor: '#2196F3',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});