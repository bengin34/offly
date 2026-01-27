import { Platform } from 'react-native';

// Light theme colors
export const lightColors = {
  // Brand palette (coastal + sunset)
  primary: '#F0705A', // Sunset coral
  primaryLight: '#FF8B73',
  primaryDark: '#D85A46',
  accent: '#0E3A4C', // Deep coastal blue
  accentLight: '#1E5268',
  accentSoft: '#DCEAF0',

  // Backgrounds
  background: '#F6EFE7',
  backgroundSecondary: '#FBF7F2',
  card: '#FFFFFF',

  // Text
  text: '#1F2A33',
  textSecondary: '#50606C',
  textMuted: '#7C8A95',

  // Borders
  border: '#E7DDD3',
  borderLight: '#F0E8E0',

  // Entry types
  place: '#2E8B7B', // Teal for places
  moment: '#F2A65A', // Amber for moments

  // States
  success: '#2E8B7B',
  warning: '#F2A65A',
  error: '#E35D6A',

  // Misc
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(15, 23, 42, 0.45)',
  shadow: 'rgba(15, 23, 42, 0.12)',
};

// Dark theme colors
export const darkColors = {
  // Brand palette (coastal + sunset)
  primary: '#FF8B73', // Lighter coral for dark mode
  primaryLight: '#FFB5A5',
  primaryDark: '#F0705A',
  accent: '#5BA3C0', // Lighter blue for dark mode
  accentLight: '#7EBDD6',
  accentSoft: '#1E3A4C',

  // Backgrounds
  background: '#0F1419',
  backgroundSecondary: '#1A2128',
  card: '#232D36',

  // Text
  text: '#E8ECEF',
  textSecondary: '#A8B5C0',
  textMuted: '#6B7B88',

  // Borders
  border: '#2E3A44',
  borderLight: '#384450',

  // Entry types
  place: '#3DA898', // Brighter teal for dark mode
  moment: '#FFBE70', // Brighter amber for dark mode

  // States
  success: '#3DA898',
  warning: '#FFBE70',
  error: '#FF6B7A',

  // Misc
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.65)',
  shadow: 'rgba(0, 0, 0, 0.4)',
};

export type ColorScheme = typeof lightColors;

// Default export for backwards compatibility
export const colors = lightColors;

export const fonts = {
  display: Platform.select({
    ios: 'AvenirNext-DemiBold',
    android: 'serif',
    default: 'System',
  }),
  heading: Platform.select({
    ios: 'AvenirNext-Medium',
    android: 'serif',
    default: 'System',
  }),
  body: Platform.select({
    ios: 'AvenirNext-Regular',
    android: 'sans-serif',
    default: 'System',
  }),
  ui: Platform.select({
    ios: 'AvenirNext-Medium',
    android: 'sans-serif-medium',
    default: 'System',
  }),
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 6,
  md: 12,
  lg: 18,
  xl: 24,
  full: 9999,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};
