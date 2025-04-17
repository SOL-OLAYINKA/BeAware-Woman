import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { format, addDays } from 'date-fns';

export interface CycleEntry {
  id: string;
  start_date: string;
  end_date: string;
  type: 'period' | 'ovulation';
  flow_intensity?: 'light' | 'medium' | 'heavy';
}

export interface CyclePreferences {
  average_cycle_length: number;
  notify_period_reminder: boolean;
  notify_ovulation_reminder: boolean;
  notify_log_reminder: boolean;
  notification_sound_period: string;
  notification_sound_ovulation: string;
  notification_sound_log: string;
  notification_time: string;
}

export function useCycleData() {
  const [entries, setEntries] = useState<CycleEntry[]>([]);
  const [preferences, setPreferences] = useState<CyclePreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCycleData();
  }, []);

  const loadCycleData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load cycle entries
      const { data: entriesData, error: entriesError } = await supabase
        .from('cycle_entries')
        .select('*')
        .order('start_date', { ascending: false });

      if (entriesError) throw entriesError;

      // Load preferences
      const { data: prefsData, error: prefsError } = await supabase
        .from('cycle_preferences')
        .select('*')
        .single();

      if (prefsError && prefsError.code !== 'PGRST116') throw prefsError;

      setEntries(entriesData || []);
      setPreferences(prefsData || {
        average_cycle_length: 28,
        notify_period_reminder: true,
        notify_ovulation_reminder: true,
        notify_log_reminder: true,
        notification_sound_period: 'GentleBell.mp3',
        notification_sound_ovulation: 'ChimeBreeze.mp3',
        notification_sound_log: 'GentleBell.mp3',
        notification_time: '09:00:00',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load cycle data');
    } finally {
      setLoading(false);
    }
  };

  const saveCycleEntry = async (entry: Omit<CycleEntry, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('cycle_entries')
        .insert([entry])
        .select()
        .single();

      if (error) throw error;

      setEntries(prev => [data, ...prev]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save cycle entry');
      throw err;
    }
  };

  const updatePreferences = async (newPrefs: Partial<CyclePreferences>) => {
    try {
      const { data, error } = await supabase
        .from('cycle_preferences')
        .upsert([{ ...preferences, ...newPrefs }])
        .select()
        .single();

      if (error) throw error;

      setPreferences(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
      throw err;
    }
  };

  const calculateNextPeriod = () => {
    if (!entries.length || !preferences) return null;

    const lastPeriod = entries.find(e => e.type === 'period');
    if (!lastPeriod) return null;

    return format(
      addDays(new Date(lastPeriod.start_date), preferences.average_cycle_length),
      'yyyy-MM-dd'
    );
  };

  const calculateOvulation = () => {
    const nextPeriod = calculateNextPeriod();
    if (!nextPeriod) return null;

    return format(
      addDays(new Date(nextPeriod), -14),
      'yyyy-MM-dd'
    );
  };

  return {
    entries,
    preferences,
    loading,
    error,
    saveCycleEntry,
    updatePreferences,
    calculateNextPeriod,
    calculateOvulation,
    refresh: loadCycleData,
  };
}