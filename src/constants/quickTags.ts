import type { Ionicons } from '@expo/vector-icons';

export type QuickTag = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

// Pregnancy-specific quick tags — shown first when user is in pregnancy mode
export const PREGNANCY_QUICK_TAGS: QuickTag[] = [
  { key: 'prenatal', label: 'Prenatal Visit', icon: 'medkit' },
  { key: 'ultrasound', label: 'Ultrasound', icon: 'scan' },
  { key: 'firstKick', label: 'First Kick', icon: 'hand-right' },
  { key: 'babyMovement', label: 'Baby Movement', icon: 'pulse' },
  { key: 'heartbeat', label: 'Heartbeat', icon: 'heart-circle' },
  { key: 'babyShower', label: 'Baby Shower', icon: 'gift' },
  { key: 'morningMsickness', label: 'Morning Sickness', icon: 'bandage' },
  { key: 'cravings', label: 'Cravings', icon: 'fast-food' },
  { key: 'nesting', label: 'Nesting', icon: 'home' },
  { key: 'genderReveal', label: 'Gender Reveal', icon: 'help-circle' },
  { key: 'announcement', label: 'Announcement', icon: 'megaphone' },
  { key: 'nursery', label: 'Nursery Prep', icon: 'bed' },
  { key: 'trimester', label: 'Trimester', icon: 'timer' },
  { key: 'birthPrep', label: 'Birth Prep', icon: 'clipboard' },
  { key: 'symptoms', label: 'Symptoms', icon: 'thermometer' },
];

// Predefined quick tags for baby-related memories
export const QUICK_TAGS: QuickTag[] = [
  { key: 'firstTime', label: 'First Time', icon: 'star' },
  { key: 'milestone', label: 'Milestone', icon: 'ribbon' },
  { key: 'funny', label: 'Funny', icon: 'happy' },
  { key: 'sweet', label: 'Sweet', icon: 'heart' },
  { key: 'growth', label: 'Growth', icon: 'trending-up' },
  { key: 'health', label: 'Health', icon: 'medical' },
  { key: 'feeding', label: 'Feeding', icon: 'restaurant' },
  { key: 'sleep', label: 'Sleep', icon: 'moon' },
  { key: 'play', label: 'Play', icon: 'game-controller' },
  { key: 'family', label: 'Family', icon: 'people' },
  { key: 'outdoor', label: 'Outdoor', icon: 'sunny' },
  { key: 'learning', label: 'Learning', icon: 'school' },
  { key: 'birthday', label: 'Birthday', icon: 'gift' },
  { key: 'holiday', label: 'Holiday', icon: 'calendar' },
  { key: 'travel', label: 'Travel', icon: 'airplane' },
  { key: 'doctor', label: 'Doctor Visit', icon: 'fitness' },
  { key: 'bath', label: 'Bath Time', icon: 'water' },
  { key: 'teeth', label: 'Teeth', icon: 'sparkles' },
  { key: 'walking', label: 'Walking', icon: 'walk' },
  { key: 'talking', label: 'Talking', icon: 'chatbubble' },
  { key: 'crawling', label: 'Crawling', icon: 'body' },
  { key: 'friends', label: 'Friends', icon: 'people-circle' },
  { key: 'pet', label: 'With Pet', icon: 'paw' },
  { key: 'messy', label: 'Messy', icon: 'color-fill' },
];
