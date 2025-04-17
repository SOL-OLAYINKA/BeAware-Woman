import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Calendar as RNCalendar, DateData } from 'react-native-calendars';
import { format, addDays, subDays } from 'date-fns';
import { Bell, Settings } from 'lucide-react-native';
import { Link, useRouter } from 'expo-router';

// Mock data - replace with actual data from backend
const mockCycleData = {
  lastPeriod: '2024-02-01',
  cycleLength: 28,
  periodLength: 5,
  notifications: {
    periodReminder: true,
    ovulationReminder: true,
    logReminder: true,
  },
};

type MarkedDates = {
  [date: string]: {
    marked?: boolean;
    selected?: boolean;
    selectedColor?: string;
    dotColor?: string;
    startingDay?: boolean;
    endingDay?: boolean;
  };
};

export default function CycleScreen() {
  const router = useRouter();
  const today = format(new Date(), 'yyyy-MM-dd');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [phaseInfo, setPhaseInfo] = useState<string | null>(null);

  // Calculate cycle phases
  const calculateMarkedDates = () => {
    const markedDates: MarkedDates = {};
    const lastPeriodDate = new Date(mockCycleData.lastPeriod);
    
    // Period days (red)
    for (let i = 0; i < mockCycleData.periodLength; i++) {
      const date = format(addDays(lastPeriodDate, i), 'yyyy-MM-dd');
      markedDates[date] = {
        marked: true,
        dotColor: '#FF6B8B',
      };
    }

    // Ovulation day (green) - typically 14 days before next period
    const ovulationDate = format(
      addDays(lastPeriodDate, mockCycleData.cycleLength - 14),
      'yyyy-MM-dd'
    );
    markedDates[ovulationDate] = {
      marked: true,
      dotColor: '#4CAF50',
    };

    // Fertile window (yellow) - 5 days before ovulation
    for (let i = 1; i <= 5; i++) {
      const date = format(
        subDays(new Date(ovulationDate), i),
        'yyyy-MM-dd'
      );
      markedDates[date] = {
        marked: true,
        dotColor: '#FFC107',
      };
    }

    // PMS phase (purple) - 5 days before next period
    const nextPeriodDate = addDays(lastPeriodDate, mockCycleData.cycleLength);
    for (let i = 1; i <= 5; i++) {
      const date = format(
        subDays(nextPeriodDate, i),
        'yyyy-MM-dd'
      );
      markedDates[date] = {
        marked: true,
        dotColor: '#9C27B0',
      };
    }

    // Today
    markedDates[today] = {
      ...markedDates[today],
      selected: true,
      selectedColor: '#FF6B8B',
    };

    return markedDates;
  };

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    // Calculate and set phase info based on the selected date
    // This is a simplified example - implement full phase calculation logic
    if (day.dateString === mockCycleData.lastPeriod) {
      setPhaseInfo('Period Day 1');
    } else if (day.dateString === format(addDays(new Date(mockCycleData.lastPeriod), mockCycleData.cycleLength - 14), 'yyyy-MM-dd')) {
      setPhaseInfo('Ovulation Day');
    } else {
      setPhaseInfo('Regular Day');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Cycle Tracker</Text>
            <Text style={styles.subtitle}>Track your menstrual cycle and ovulation</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => router.push('/cycle/settings')}>
              <Settings size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <RNCalendar
        style={styles.calendar}
        theme={{
          calendarBackground: '#FFF',
          textSectionTitleColor: '#666',
          selectedDayBackgroundColor: '#FF6B8B',
          selectedDayTextColor: '#FFF',
          todayTextColor: '#FF6B8B',
          dayTextColor: '#333',
          textDisabledColor: '#D9E1E8',
          dotColor: '#FF6B8B',
          monthTextColor: '#333',
          textMonthFontFamily: 'Inter-SemiBold',
          textDayFontFamily: 'Inter-Regular',
          textDayHeaderFontFamily: 'Inter-SemiBold',
        }}
        markedDates={calculateMarkedDates()}
        onDayPress={handleDayPress}
        enableSwipeMonths={true}
      />

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Legend</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#FF6B8B' }]} />
            <Text style={styles.legendText}>Period</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.legendText}>Ovulation</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#FFC107' }]} />
            <Text style={styles.legendText}>Fertile Window</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: '#9C27B0' }]} />
            <Text style={styles.legendText}>PMS</Text>
          </View>
        </View>
      </View>

      <View style={styles.phaseInfo}>
        <Text style={styles.phaseTitle}>Current Phase</Text>
        <Text style={styles.phaseText}>Follicular Phase</Text>
        <Text style={styles.phaseDescription}>
          Your body is preparing for ovulation. This is a great time for high-energy activities!
        </Text>
      </View>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/cycle/log-period')}>
        <Text style={styles.addButtonText}>Log Period</Text>
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
    paddingTop: 60,
    backgroundColor: '#FFF',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
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
  legend: {
    margin: 20,
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  legendTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: '45%',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  phaseInfo: {
    margin: 20,
    padding: 20,
    backgroundColor: '#FFF5F7',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  phaseTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B8B',
    marginBottom: 8,
  },
  phaseText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginBottom: 8,
  },
  phaseDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    lineHeight: 20,
  },
  addButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#FF6B8B',
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});