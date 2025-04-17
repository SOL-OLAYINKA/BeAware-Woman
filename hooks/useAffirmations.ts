import { useState, useEffect } from 'react';

const affirmations = [
  "I am in tune with my body's natural rhythm and wisdom",
  "Every day, I grow stronger and healthier",
  "I listen to my body and honor its needs",
  "I am worthy of health, happiness, and healing",
  "My body is a temple of strength and vitality",
  "I embrace my natural cycles with grace and understanding",
  "My well-being is a priority, and I honor it daily",
  "I am connected to my body's wisdom and inner guidance",
  "Each day brings new opportunities for healing and growth",
  "I radiate health, vitality, and positive energy",
];

export interface Affirmation {
  text: string;
  date: string;
}

export function useAffirmations() {
  const [dailyAffirmation, setDailyAffirmation] = useState<Affirmation | null>(null);
  const [savedAffirmations, setSavedAffirmations] = useState<Affirmation[]>([]);

  useEffect(() => {
    // Get today's date as string
    const today = new Date().toISOString().split('T')[0];
    
    // Use the date to deterministically select an affirmation
    const dayNumber = new Date().getDate();
    const affirmationIndex = dayNumber % affirmations.length;
    
    setDailyAffirmation({
      text: affirmations[affirmationIndex],
      date: today,
    });
  }, []);

  const saveAffirmation = (affirmation: Affirmation) => {
    setSavedAffirmations(prev => {
      // Check if already saved
      const isAlreadySaved = prev.some(saved => 
        saved.text === affirmation.text && saved.date === affirmation.date
      );
      
      if (isAlreadySaved) {
        return prev.filter(saved => 
          !(saved.text === affirmation.text && saved.date === affirmation.date)
        );
      }
      
      return [...prev, affirmation];
    });
  };

  const isAffirmationSaved = (affirmation: Affirmation) => {
    return savedAffirmations.some(saved => 
      saved.text === affirmation.text && saved.date === affirmation.date
    );
  };

  return {
    dailyAffirmation,
    savedAffirmations,
    saveAffirmation,
    isAffirmationSaved,
  };
}