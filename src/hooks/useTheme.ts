import { useColorScheme } from 'react-native';
import { getPaletteColors, ColorScheme, ThemePalette } from '../constants/colors';
import { useThemeStore, ThemeMode } from '../stores/themeStore';

export interface ThemeColors extends ColorScheme {
  isDark: boolean;
}

export function useTheme(): ThemeColors {
  const systemColorScheme = useColorScheme();
  const { mode, palette } = useThemeStore();

  const isDark =
    mode === 'dark' || (mode === 'system' && systemColorScheme === 'dark');

  const colors = getPaletteColors(palette, isDark);

  return {
    ...colors,
    isDark,
  };
}

export function useThemeMode(): {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  palette: ThemePalette;
  setPalette: (palette: ThemePalette) => void;
  isDark: boolean;
} {
  const systemColorScheme = useColorScheme();
  const { mode, setMode, palette, setPalette } = useThemeStore();

  const isDark =
    mode === 'dark' || (mode === 'system' && systemColorScheme === 'dark');

  return { mode, setMode, palette, setPalette, isDark };
}
