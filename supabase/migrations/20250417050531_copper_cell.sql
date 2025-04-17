/*
  # Cycle Tracker Database Schema

  1. New Tables
    - `cycle_entries`
      - Stores period and ovulation entries
      - Links to user profiles
      - Tracks flow intensity and symptoms
    
    - `cycle_preferences`
      - Stores user-specific cycle settings
      - Average cycle length
      - Notification preferences
      - Default flow settings

  2. Security
    - Enable RLS on all tables
    - Users can only access their own data
    - Authenticated users can read/write their own entries

  3. Changes
    - Creates initial schema for cycle tracking
    - Sets up necessary indexes for performance
    - Establishes foreign key relationships
*/

-- Create cycle entries table
CREATE TABLE IF NOT EXISTS cycle_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  type text NOT NULL CHECK (type IN ('period', 'ovulation')),
  flow_intensity text CHECK (
    type = 'period' AND flow_intensity IN ('light', 'medium', 'heavy')
    OR type = 'ovulation' AND flow_intensity IS NULL
  ),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Ensure end_date is not before start_date
  CONSTRAINT valid_date_range CHECK (end_date >= start_date)
);

-- Create cycle preferences table
CREATE TABLE IF NOT EXISTS cycle_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  average_cycle_length int NOT NULL DEFAULT 28 CHECK (average_cycle_length > 0),
  notify_period_reminder boolean DEFAULT true,
  notify_ovulation_reminder boolean DEFAULT true,
  notify_log_reminder boolean DEFAULT true,
  notification_sound_period text DEFAULT 'GentleBell.mp3',
  notification_sound_ovulation text DEFAULT 'ChimeBreeze.mp3',
  notification_sound_log text DEFAULT 'GentleBell.mp3',
  notification_time time DEFAULT '09:00:00',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE cycle_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycle_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for cycle_entries
CREATE POLICY "Users can view their own cycle entries"
  ON cycle_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cycle entries"
  ON cycle_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cycle entries"
  ON cycle_entries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cycle entries"
  ON cycle_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for cycle_preferences
CREATE POLICY "Users can view their own preferences"
  ON cycle_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON cycle_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON cycle_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS cycle_entries_user_id_idx ON cycle_entries(user_id);
CREATE INDEX IF NOT EXISTS cycle_entries_start_date_idx ON cycle_entries(start_date);
CREATE INDEX IF NOT EXISTS cycle_entries_type_idx ON cycle_entries(type);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_cycle_entries_updated_at
  BEFORE UPDATE ON cycle_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cycle_preferences_updated_at
  BEFORE UPDATE ON cycle_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate next period date
CREATE OR REPLACE FUNCTION calculate_next_period(
  p_user_id uuid
)
RETURNS date AS $$
DECLARE
  last_period_date date;
  cycle_length int;
BEGIN
  -- Get the user's last period start date
  SELECT start_date 
  INTO last_period_date
  FROM cycle_entries
  WHERE user_id = p_user_id 
    AND type = 'period'
  ORDER BY start_date DESC
  LIMIT 1;

  -- Get user's average cycle length
  SELECT average_cycle_length 
  INTO cycle_length
  FROM cycle_preferences
  WHERE user_id = p_user_id;

  -- If no cycle length set, use default 28 days
  IF cycle_length IS NULL THEN
    cycle_length := 28;
  END IF;

  -- Calculate and return next period date
  RETURN last_period_date + (cycle_length * INTERVAL '1 day');
END;
$$ LANGUAGE plpgsql;

-- Function to calculate ovulation date
CREATE OR REPLACE FUNCTION calculate_ovulation_date(
  p_user_id uuid
)
RETURNS date AS $$
DECLARE
  next_period date;
BEGIN
  -- Get next period date
  next_period := calculate_next_period(p_user_id);
  
  -- Ovulation typically occurs 14 days before next period
  RETURN next_period - INTERVAL '14 days';
END;
$$ LANGUAGE plpgsql;