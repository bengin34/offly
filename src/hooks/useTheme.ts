import { useColorScheme } from 'react-native';
import { lightColors, darkColors, ColorScheme } from '../constants/colors';
import { useThemeStore, ThemeMode } from '../stores/themeStore';

export interface ThemeColors extends ColorScheme {
  isDark: boolean;
}

export function useTheme(): ThemeColors {
  const systemColorScheme = useColorScheme();
  const { mode } = useThemeStore();

  const isDark =
    mode === 'dark' || (mode === 'system' && systemColorScheme === 'dark');

  const colors = isDark ? darkColors : lightColors;

  return {
    ...colors,
    isDark,
  };
}

export function useThemeMode(): {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
} {
  const systemColorScheme = useColorScheme();
  const { mode, setMode } = useThemeStore();

  const isDark =
    mode === 'dark' || (mode === 'system' && systemColorScheme === 'dark');

  return { mode, setMode, isDark };
}
