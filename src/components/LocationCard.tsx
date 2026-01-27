import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { useI18n } from "../hooks/useI18n";
import { spacing, fontSize, borderRadius, fonts } from "../constants";
import { openInMaps } from "../utils/mapOpener";
import { isValidCoordinates } from "../utils/mapUrlParser";

interface LocationCardProps {
  locationName?: string;
  latitude?: number;
  longitude?: number;
  mapUrl?: string;
}

export function LocationCard({
  locationName,
  latitude,
  longitude,
  mapUrl,
}: LocationCardProps) {
  const theme = useTheme();
  const { t } = useI18n();

  const hasCoordinates = isValidCoordinates(latitude, longitude);
  const hasLocation = locationName || hasCoordinates;

  if (!hasLocation) return null;

  const handleOpenMaps = async () => {
    const success = await openInMaps({
      latitude,
      longitude,
      locationName,
      originalUrl: mapUrl,
    });

    if (!success) {
      console.warn("Failed to open maps");
    }
  };

  const styles = createStyles(theme);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handleOpenMaps}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Ionicons name="map" size={24} color={theme.primary} />
      </View>
      <View style={styles.content}>
        {locationName && (
          <Text style={styles.locationName} numberOfLines={2}>
            {locationName}
          </Text>
        )}
        {hasCoordinates && (
          <Text style={styles.coordinates}>
            {latitude?.toFixed(5)}, {longitude?.toFixed(5)}
          </Text>
        )}
      </View>
      <View style={styles.openButton}>
        <Text style={styles.openButtonText}>
          {t("entryDetail.openInMaps")}
        </Text>
        <Ionicons name="open-outline" size={16} color={theme.primary} />
      </View>
    </TouchableOpacity>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.card,
      borderRadius: borderRadius.xl,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: theme.borderLight,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 2,
      gap: spacing.md,
    },
    iconContainer: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.md,
      backgroundColor: theme.accentSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    content: {
      flex: 1,
      gap: spacing.xs / 2,
    },
    locationName: {
      fontSize: fontSize.md,
      fontFamily: fonts.ui,
      color: theme.text,
    },
    coordinates: {
      fontSize: fontSize.xs,
      fontFamily: fonts.body,
      color: theme.textMuted,
    },
    openButton: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    openButtonText: {
      fontSize: fontSize.sm,
      fontFamily: fonts.ui,
      color: theme.primary,
    },
  });
}
