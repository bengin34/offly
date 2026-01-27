import { Text, StyleSheet } from 'react-native';
import { fontSize, fonts } from '../constants';
import { useTheme } from '../hooks';

export const HEADER_ACTION_BUTTON_SIZE = 36;
export const HEADER_ACTION_BUTTON_GAP = 0;
export const HEADER_ACTIONS_WIDTH = HEADER_ACTION_BUTTON_SIZE;

type PageTitleProps = {
  title: string;
};

export function PageTitle({ title }: PageTitleProps) {
  const theme = useTheme();

  return (
    <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.display,
    fontSize: fontSize.lg,
    textAlign: 'center',
  },
});
