import { Platform } from 'react-native';

export type ThemePalette = 'blush' | 'sky' | 'mint' | 'lavender';

// Blush palette (default)
const blushLightColors = {
  primary: '#E8A0BF',
  primaryLight: '#F0C0D8',
  primaryDark: '#D080A0',
  accent: '#7BB5C4',
  accentLight: '#9ECDD8',
  accentSoft: '#E3F0F4',
  background: '#FBF8F5',
  backgroundSecondary: '#FFFFFF',
  card: '#FFFFFF',
  text: '#2C2C2E',
  textSecondary: '#5A5A5E',
  textMuted: '#8E8E93',
  border: '#E8E4E0',
  borderLight: '#F2EFEC',
  milestone: '#8BC5A3',
  memory: '#F2C572',
  success: '#8BC5A3',
  warning: '#F2C572',
  error: '#E08080',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(15, 23, 42, 0.45)',
  shadow: 'rgba(15, 23, 42, 0.12)',
};

const blushDarkColors = {
  primary: '#F0C0D8',
  primaryLight: '#F5D5E5',
  primaryDark: '#E8A0BF',
  accent: '#9ECDD8',
  accentLight: '#B5DCE5',
  accentSoft: '#1E3038',
  background: '#121214',
  backgroundSecondary: '#1C1C1E',
  card: '#2C2C2E',
  text: '#F2F2F7',
  textSecondary: '#AEAEB2',
  textMuted: '#636366',
  border: '#38383A',
  borderLight: '#48484A',
  milestone: '#A3D4B8',
  memory: '#F5D590',
  success: '#A3D4B8',
  warning: '#F5D590',
  error: '#F0A0A0',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.65)',
  shadow: 'rgba(0, 0, 0, 0.4)',
};

// Sky palette
const skyLightColors = {
  primary: '#9EC6E8',
  primaryLight: '#C4DDF2',
  primaryDark: '#7FAFD8',
  accent: '#7BB5C4',
  accentLight: '#9ECDD8',
  accentSoft: '#E6F2F6',
  background: '#F7FAFD',
  backgroundSecondary: '#FFFFFF',
  card: '#FFFFFF',
  text: '#243447',
  textSecondary: '#56657A',
  textMuted: '#8793A4',
  border: '#E2EBF3',
  borderLight: '#EFF4F8',
  milestone: '#8FCFB3',
  memory: '#F3D28D',
  success: '#8FCFB3',
  warning: '#F3D28D',
  error: '#E6A3A8',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(15, 23, 42, 0.45)',
  shadow: 'rgba(15, 23, 42, 0.12)',
};

const skyDarkColors = {
  primary: '#C4DDF2',
  primaryLight: '#D9EAF7',
  primaryDark: '#9EC6E8',
  accent: '#9ECDD8',
  accentLight: '#B5DEE6',
  accentSoft: '#1D3038',
  background: '#12161C',
  backgroundSecondary: '#1A212B',
  card: '#273242',
  text: '#EEF4FB',
  textSecondary: '#B3BFCE',
  textMuted: '#748295',
  border: '#354459',
  borderLight: '#46566B',
  milestone: '#A7DCC4',
  memory: '#F6DFAB',
  success: '#A7DCC4',
  warning: '#F6DFAB',
  error: '#F0B1B6',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.65)',
  shadow: 'rgba(0, 0, 0, 0.4)',
};

// Mint palette
const mintLightColors = {
  primary: '#A9D7C1',
  primaryLight: '#C9E8DA',
  primaryDark: '#8DC3AB',
  accent: '#B5C9E8',
  accentLight: '#CDD9F1',
  accentSoft: '#ECF2FB',
  background: '#F8FCFA',
  backgroundSecondary: '#FFFFFF',
  card: '#FFFFFF',
  text: '#27342E',
  textSecondary: '#5B6C63',
  textMuted: '#8A9791',
  border: '#E3ECE7',
  borderLight: '#EFF5F1',
  milestone: '#84C8AA',
  memory: '#F1D6A5',
  success: '#84C8AA',
  warning: '#F1D6A5',
  error: '#E5A5A5',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(15, 23, 42, 0.45)',
  shadow: 'rgba(15, 23, 42, 0.12)',
};

const mintDarkColors = {
  primary: '#C9E8DA',
  primaryLight: '#DDF1E7',
  primaryDark: '#A9D7C1',
  accent: '#CDD9F1',
  accentLight: '#DEE5F6',
  accentSoft: '#1D2736',
  background: '#121715',
  backgroundSecondary: '#1A221F',
  card: '#25312C',
  text: '#EDF5F1',
  textSecondary: '#B2C0B9',
  textMuted: '#73817A',
  border: '#35443E',
  borderLight: '#46564F',
  milestone: '#A1D9C3',
  memory: '#F4E0BC',
  success: '#A1D9C3',
  warning: '#F4E0BC',
  error: '#EEB5B5',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.65)',
  shadow: 'rgba(0, 0, 0, 0.4)',
};

// Lavender palette
const lavenderLightColors = {
  primary: '#C7B4E8',
  primaryLight: '#DDCEF2',
  primaryDark: '#AA95D5',
  accent: '#F0C3B6',
  accentLight: '#F5D7CE',
  accentSoft: '#FBEEEA',
  background: '#FAF8FD',
  backgroundSecondary: '#FFFFFF',
  card: '#FFFFFF',
  text: '#2F2B3A',
  textSecondary: '#655F75',
  textMuted: '#928BA5',
  border: '#E8E3F1',
  borderLight: '#F2EFF7',
  milestone: '#B0D3B6',
  memory: '#F4D09A',
  success: '#B0D3B6',
  warning: '#F4D09A',
  error: '#E8A6B0',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(15, 23, 42, 0.45)',
  shadow: 'rgba(15, 23, 42, 0.12)',
};

const lavenderDarkColors = {
  primary: '#DDCEF2',
  primaryLight: '#E8DDF7',
  primaryDark: '#C7B4E8',
  accent: '#F5D7CE',
  accentLight: '#F8E3DD',
  accentSoft: '#302536',
  background: '#15131A',
  backgroundSecondary: '#1F1B26',
  card: '#2B2636',
  text: '#F3F0F9',
  textSecondary: '#BCB5CC',
  textMuted: '#7E778F',
  border: '#3D374B',
  borderLight: '#4E465E',
  milestone: '#C1DEBF',
  memory: '#F6DEB4',
  success: '#C1DEBF',
  warning: '#F6DEB4',
  error: '#F0B6C0',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0, 0, 0, 0.65)',
  shadow: 'rgba(0, 0, 0, 0.4)',
};

export type ColorScheme = typeof blushLightColors;

export const lightPaletteColors: Record<ThemePalette, ColorScheme> = {
  blush: blushLightColors,
  sky: skyLightColors,
  mint: mintLightColors,
  lavender: lavenderLightColors,
};

export const darkPaletteColors: Record<ThemePalette, ColorScheme> = {
  blush: blushDarkColors,
  sky: skyDarkColors,
  mint: mintDarkColors,
  lavender: lavenderDarkColors,
};

export const paletteMetadata: Record<
  ThemePalette,
  { label: string; description: string; icon: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap }
> = {
  blush: {
    label: 'Baby Girl (Pink)',
    description: 'Soft blush pastel tones',
    icon: 'heart-outline',
  },
  sky: {
    label: 'Baby Boy (Blue)',
    description: 'Calm pastel blue tones',
    icon: 'water-outline',
  },
  mint: {
    label: 'Mint Garden',
    description: 'Fresh green pastel tones',
    icon: 'leaf-outline',
  },
  lavender: {
    label: 'Lavender Dream',
    description: 'Gentle purple pastel tones',
    icon: 'flower-outline',
  },
};

export function getPaletteColors(palette: ThemePalette, isDark: boolean): ColorScheme {
  const set = isDark ? darkPaletteColors : lightPaletteColors;
  return set[palette] ?? set.blush;
}

// Backwards-compatible exports
export const lightColors = blushLightColors;
export const darkColors = blushDarkColors;
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
