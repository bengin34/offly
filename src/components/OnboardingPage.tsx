import { View, Text, StyleSheet, Dimensions, Image, useWindowDimensions, type ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks';
import { spacing, fontSize, fonts } from '../constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export type OnboardingPageData = {
  id: string;
  icon?: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  title: string;
  subtitle: string;
  image?: ImageSourcePropType;
};

type Props = {
  data: OnboardingPageData;
};

export function OnboardingPage({ data }: Props) {
  const theme = useTheme();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const styles = createStyles(theme);
  const imageHeight = Math.round(windowHeight * 0.5);
  const imageWidth = Math.round(windowWidth);
  const imageScale = 1.1;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View
          style={[
            styles.iconContainer,
            data.image ? styles.imageContainer : null,
            {
              backgroundColor: data.image ? 'transparent' : `${data.iconColor}15`,
              width: data.image ? imageWidth : 140,
              height: data.image ? imageHeight : 140,
              borderRadius: data.image ? 0 : 70,
            },
          ]}
        >
          {data.image ? (
            <>
              <Image
                source={data.image}
                style={[styles.image, { width: imageWidth, height: imageHeight, transform: [{ scale: imageScale }] }]}
                resizeMode="cover"
              />
              {data.icon && (
                <View style={[styles.iconBadge, { backgroundColor: `${data.iconColor}15`, borderColor: theme.background }]}>
                  <Ionicons
                    name={data.icon}
                    size={28}
                    color={data.iconColor}
                  />
                </View>
              )}
            </>
          ) : data.icon ? (
            <Ionicons
              name={data.icon}
              size={72}
              color={data.iconColor}
            />
          ) : null}
        </View>
        <Text style={styles.title}>{data.title}</Text>
        <Text style={styles.subtitle}>{data.subtitle}</Text>
      </View>
    </View>
  );
}

const createStyles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      width: SCREEN_WIDTH,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing.xl,
    },
    content: {
      alignItems: 'center',
      maxWidth: 320,
    },
    iconContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    imageContainer: {
      width: '100%',
      borderRadius: 0,
      overflow: 'hidden',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    iconBadge: {
      position: 'absolute',
      bottom: -28,
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 4,
    },
    title: {
      fontSize: fontSize.xxl,
      fontFamily: fonts.display,
      color: theme.text,
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    subtitle: {
      fontSize: fontSize.md,
      fontFamily: fonts.body,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
    },
  });
