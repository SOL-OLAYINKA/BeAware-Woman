import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { Activity, ThermometerSun, Moon } from 'lucide-react-native';

const mockLogs = [
  {
    date: '2024-02-17',
    mood: 'happy',
    symptoms: ['cramps', 'fatigue'],
    energyLevel: 6,
    notes: 'Feeling pretty good today despite some mild cramps.',
  },
  {
    date: '2024-02-16',
    mood: 'tired',
    symptoms: ['headache', 'bloating'],
    energyLevel: 3,
    notes: 'Low energy day, need to rest more.',
  },
];

export default function LogHistoryScreen() {
  return (
    <ScrollView style={styles.container}>
      {mockLogs.map((log, index) => (
        <View key={index} style={styles.logCard}>
          <View style={styles.dateHeader}>
            <Text style={styles.date}>
              {format(new Date(log.date), 'MMMM d, yyyy')}
            </Text>
          </View>

          <View style={styles.logContent}>
            <View style={styles.logSection}>
              <Text style={styles.sectionTitle}>Mood</Text>
              <Text style={styles.moodText}>{log.mood}</Text>
            </View>

            <View style={styles.logSection}>
              <Text style={styles.sectionTitle}>Symptoms</Text>
              <View style={styles.symptomsContainer}>
                {log.symptoms.map((symptom, i) => (
                  <View key={i} style={styles.symptomTag}>
                    <Text style={styles.symptomText}>{symptom}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.logSection}>
              <Text style={styles.sectionTitle}>Energy Level</Text>
              <View style={styles.energyLevel}>
                <View 
                  style={[
                    styles.energyBar,
                    { width: `${log.energyLevel * 10}%` },
                    { 
                      backgroundColor: 
                        log.energyLevel <= 3 ? '#F44336' :
                        log.energyLevel <= 7 ? '#FF9800' : '#4CAF50'
                    }
                  ]} 
                />
                <Text style={styles.energyText}>{log.energyLevel}/10</Text>
              </View>
            </View>

            {log.notes && (
              <View style={styles.logSection}>
                <Text style={styles.sectionTitle}>Notes</Text>
                <Text style={styles.notes}>{log.notes}</Text>
              </View>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 15,
  },
  logCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  dateHeader: {
    backgroundColor: '#FF6B8B',
    padding: 12,
  },
  date: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  logContent: {
    padding: 15,
  },
  logSection: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#666',
    marginBottom: 8,
  },
  moodText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
    textTransform: 'capitalize',
  },
  symptomsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symptomTag: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  symptomText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textTransform: 'capitalize',
  },
  energyLevel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  energyBar: {
    height: 8,
    borderRadius: 4,
    flex: 1,
  },
  energyText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#666',
    minWidth: 45,
  },
  notes: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    lineHeight: 20,
  },
});