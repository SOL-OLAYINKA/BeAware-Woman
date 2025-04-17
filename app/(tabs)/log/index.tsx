import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { router } from 'expo-router';
import { Smile, Frown, Meh, ThermometerSun, Moon, Activity, Coffee, Droplet, Heart, History } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const moods = [
  { icon: Smile, label: 'Happy', value: 'happy', color: '#4CAF50' },
  { icon: Heart, label: 'Loved', value: 'loved', color: '#E91E63' },
  { icon: Activity, label: 'Energetic', value: 'energetic', color: '#2196F3' },
  { icon: Meh, label: 'Neutral', value: 'neutral', color: '#FF9800' },
  { icon: Moon, label: 'Tired', value: 'tired', color: '#9C27B0' },
  { icon: Frown, label: 'Sad', value: 'sad', color: '#F44336' },
];

const symptoms = [
  { icon: Droplet, label: 'Cramps', value: 'cramps', color: '#FF6B8B' },
  { icon: ThermometerSun, label: 'Bloating', value: 'bloating', color: '#FF9800' },
  { icon: Activity, label: 'Headache', value: 'headache', color: '#F44336' },
  { icon: Coffee, label: 'Fatigue', value: 'fatigue', color: '#9C27B0' },
  { icon: Heart, label: 'Breast Pain', value: 'breast_pain', color: '#E91E63' },
  { icon: Moon, label: 'Insomnia', value: 'insomnia', color: '#2196F3' },
];

export default function LogScreen() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [energyLevel, setEnergyLevel] = useState<number>(5);
  const [notes, setNotes] = useState('');

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = async () => {
    try {
      // TODO: Save to symptom_logs table
      console.log({
        mood: selectedMood,
        symptoms: selectedSymptoms,
        energyLevel,
        notes,
        date: new Date().toISOString(),
      });

      // Show success message and reset form
      alert('Log saved successfully!');
      setSelectedMood(null);
      setSelectedSymptoms([]);
      setEnergyLevel(5);
      setNotes('');
    } catch (error) {
      console.error('Error saving log:', error);
      alert('Failed to save log. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Daily Log</Text>
          <Text style={styles.subtitle}>How are you feeling today?</Text>
        </View>
        <TouchableOpacity 
          style={styles.historyButton}
          onPress={() => router.push('/log/history')}>
          <History size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mood</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.moodContainer}>
          {moods.map((mood, index) => (
            <Animated.View
              key={mood.value}
              entering={FadeInDown.delay(index * 100)}>
              <TouchableOpacity
                style={[
                  styles.moodButton,
                  selectedMood === mood.value && styles.selectedMood,
                  selectedMood === mood.value && { borderColor: mood.color },
                ]}
                onPress={() => setSelectedMood(mood.value)}>
                <mood.icon
                  size={32}
                  color={selectedMood === mood.value ? mood.color : '#666'}
                />
                <Text
                  style={[
                    styles.moodLabel,
                    selectedMood === mood.value && { color: mood.color },
                  ]}>
                  {mood.label}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Symptoms</Text>
        <View style={styles.symptomsGrid}>
          {symptoms.map((symptom, index) => (
            <Animated.View
              key={symptom.value}
              style={styles.symptomWrapper}
              entering={FadeInDown.delay(index * 100)}>
              <TouchableOpacity
                style={[
                  styles.symptomButton,
                  selectedSymptoms.includes(symptom.value) && styles.selectedSymptom,
                  selectedSymptoms.includes(symptom.value) && { borderColor: symptom.color },
                ]}
                onPress={() => toggleSymptom(symptom.value)}>
                <symptom.icon
                  size={24}
                  color={selectedSymptoms.includes(symptom.value) ? symptom.color : '#666'}
                />
                <Text
                  style={[
                    styles.symptomLabel,
                    selectedSymptoms.includes(symptom.value) && { color: symptom.color },
                  ]}>
                  {symptom.label}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Energy Level</Text>
        <View style={styles.sliderContainer}>
          <Text style={[styles.sliderLabel, { color: '#F44336' }]}>Low</Text>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.energyButton,
                energyLevel === level && styles.selectedEnergy,
                energyLevel === level && {
                  backgroundColor: level <= 3 ? '#F44336' :
                                 level <= 7 ? '#FF9800' : '#4CAF50'
                }
              ]}
              onPress={() => setEnergyLevel(level)}>
              <Text style={[
                styles.energyText,
                energyLevel === level && styles.selectedEnergyText
              ]}>
                {level}
              </Text>
            </TouchableOpacity>
          ))}
          <Text style={[styles.sliderLabel, { color: '#4CAF50' }]}>High</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes</Text>
        <TextInput
          style={styles.notesInput}
          multiline
          numberOfLines={4}
          value={notes}
          onChangeText={setNotes}
          placeholder="Add any additional notes about how you're feeling today..."
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity 
        style={[
          styles.submitButton,
          (!selectedMood && !selectedSymptoms.length) && styles.submitButtonDisabled
        ]}
        onPress={handleSubmit}
        disabled={!selectedMood && !selectedSymptoms.length}>
        <Text style={styles.submitButtonText}>Save Log</Text>
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
    paddingTop: Platform.OS === 'web' ? 20 : 60,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
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
  historyButton: {
    padding: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginBottom: 15,
  },
  moodContainer: {
    flexDirection: 'row',
  },
  moodButton: {
    alignItems: 'center',
    padding: 15,
    marginRight: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
    width: 100,
  },
  selectedMood: {
    backgroundColor: '#FFF',
  },
  moodLabel: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  symptomWrapper: {
    width: '50%',
    padding: 6,
  },
  symptomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
  },
  selectedSymptom: {
    backgroundColor: '#FFF',
  },
  symptomLabel: {
    marginLeft: 10,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  sliderLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginHorizontal: 8,
  },
  energyButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  selectedEnergy: {
    backgroundColor: '#FF6B8B',
  },
  energyText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#666',
  },
  selectedEnergyText: {
    color: '#FFF',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#333',
    textAlignVertical: 'top',
    minHeight: 120,
  },
  submitButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#FF6B8B',
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#FFB6C1',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});