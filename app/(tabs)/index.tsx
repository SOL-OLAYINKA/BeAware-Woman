import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar, Moon, Heart, Share2 } from 'lucide-react-native';
import { format } from 'date-fns';
import { Link } from 'expo-router';
import { useAffirmations } from '@/hooks/useAffirmations';
import { useState } from 'react';

export default function HomeScreen() {
  const currentDate = format(new Date(), 'EEEE, MMMM d');
  const { dailyAffirmation, saveAffirmation, isAffirmationSaved } = useAffirmations();
  const [hasLoggedToday, setHasLoggedToday] = useState(false);

  // Simulate getting user data from a profile store
  const user = {
    firstName: 'Sarah',
    daysUntilPeriod: 12,
    currentPhase: 'Follicular',
    lastMood: {
      type: 'Calm',
      loggedAt: '2 days ago',
    },
  };

  const handleSaveAffirmation = () => {
    if (dailyAffirmation) {
      saveAffirmation(dailyAffirmation);
    }
  };

  const handleShareAffirmation = () => {
    // TODO: Implement share functionality
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, {user.firstName}</Text>
        <Text style={styles.date}>{currentDate}</Text>
      </View>

      {dailyAffirmation && (
        <View style={styles.affirmationCard}>
          <Text style={styles.affirmationTitle}>Daily Affirmation</Text>
          <Text style={styles.affirmationText}>"{dailyAffirmation.text}"</Text>
          <View style={styles.affirmationActions}>
            <TouchableOpacity onPress={handleSaveAffirmation} style={styles.actionButton}>
              <Heart 
                size={20} 
                color={isAffirmationSaved(dailyAffirmation) ? '#FF6B8B' : '#666'} 
                fill={isAffirmationSaved(dailyAffirmation) ? '#FF6B8B' : 'none'} 
              />
              <Text style={[
                styles.actionText, 
                isAffirmationSaved(dailyAffirmation) && styles.actionTextActive
              ]}>
                {isAffirmationSaved(dailyAffirmation) ? 'Saved' : 'Save'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShareAffirmation} style={styles.actionButton}>
              <Share2 size={20} color="#666" />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.quickStats}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Days until next period</Text>
          <Text style={styles.statValue}>{user.daysUntilPeriod}</Text>
          <Text style={styles.phaseText}>Current Phase: {user.currentPhase}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Last Mood</Text>
          <Text style={styles.statValue}>{user.lastMood.type}</Text>
          <Text style={styles.timeText}>Logged {user.lastMood.loggedAt}</Text>
        </View>
      </View>

      <Link href="/log" asChild>
        <TouchableOpacity style={styles.logButton}>
          <Text style={styles.logButtonText}>
            {hasLoggedToday ? "You've logged today 👍" : "Log Today's Symptoms"}
          </Text>
        </TouchableOpacity>
      </Link>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionButtons}>
        <Link href="/cycle" asChild>
          <TouchableOpacity style={styles.actionButton}>
            <Calendar size={24} color="#FF6B8B" />
            <Text style={styles.actionText}>Track Period</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/wellness" asChild>
          <TouchableOpacity style={styles.actionButton}>
            <Moon size={24} color="#FF6B8B" />
            <Text style={styles.actionText}>Watch Video</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/log" asChild>
          <TouchableOpacity style={styles.actionButton}>
            <Heart size={24} color="#FF6B8B" />
            <Text style={styles.actionText}>Log Mood</Text>
          </TouchableOpacity>
        </Link>
      </View>
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
  greeting: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#333',
  },
  date: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
  },
  affirmationCard: {
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
  affirmationTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FF6B8B',
    marginBottom: 8,
  },
  affirmationText: {
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#333',
    lineHeight: 24,
    marginBottom: 16,
  },
  affirmationActions: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 16,
  },
  quickStats: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    backgroundColor: '#FFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#333',
    marginTop: 4,
  },
  phaseText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
  },
  timeText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
  },
  logButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#FF6B8B',
    borderRadius: 12,
    alignItems: 'center',
  },
  logButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#333',
    marginLeft: 20,
    marginTop: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'column',
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  actionTextActive: {
    color: '#FF6B8B',
  },
});