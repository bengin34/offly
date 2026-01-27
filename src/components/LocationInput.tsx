import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../hooks/useTheme";
import { useI18n } from "../hooks/useI18n";
import { spacing, fontSize, borderRadius, fonts } from "../constants";
import {
  parseMapUrlWithExpansion,
  isMapUrl,
  isValidCoordinates,
} from "../utils/mapUrlParser";
import type { ParsedLocation } from "../types";

interface LocationInputProps {
  locationName?: string;
  latitude?: number;
  longitude?: number;
  mapUrl?: string;
  onLocationChange: (location: ParsedLocation | null) => void;
}

export function LocationInput({
  locationName,
  latitude,
  longitude,
  onLocationChange,
}: LocationInputProps) {
  const theme = useTheme();
  const { t } = useI18n();
  const [inputValue, setInputValue] = useState(locationName || "");
  const [isParsing, setIsParsing] = useState(false);

  const hasCoordinates = isValidCoordinates(latitude, longitude);

  const handleTextChange = useCallback(
    async (text: string) => {
      setInputValue(text);

      // Check if it looks like a map URL
      if (isMapUrl(text)) {
        setIsParsing(true);
        try {
          const parsed = await parseMapUrlWithExpansion(text);
          if (parsed) {
            onLocationChange(parsed);
            // Update input to show place name if extracted
            if (parsed.name) {
              setInputValue(parsed.name);
            }
          }
        } catch (error) {
          console.error("Failed to parse URL:", error);
        } finally {
          setIsParsing(false);
        }
      } else {
        // Treat as manual location name
        onLocationChange(text.trim() ? { name: text.trim() } : null);
      }
    },
    [onLocationChange]
  );

  const handlePaste = useCallback(async () => {
    try {
      const text = await Clipboard.getStringAsync();
      if (text) {
        handleTextChange(text);
      }
    } catch (error) {
      console.error("Failed to read clipboard:", error);
    }
  }, [handleTextChange]);

  const handleClear = useCallback(() => {
    setInputValue("");
    onLocationChange(null);
  }, [onLocationChange]);

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <View style={styles.inputWrapper}>
          <Ionicons
            name="location-outline"
            size={18}
            color={theme.textMuted}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            value={inputValue}
            onChangeText={handleTextChange}
            placeholder={t("entryForm.locationPlaceholder")}
            placeholderTextColor={theme.textMuted}
            autoCapitalize="words"
          />
        </View>
        {isParsing ? (
          <ActivityIndicator
            size="small"
            color={theme.primary}
            style={styles.iconButton}
          />
        ) : (
          <>
            <TouchableOpacity onPress={handlePaste} style={styles.iconButton}>
              <Ionicons
                name="clipboard-outline"
                size={20}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
            {(inputValue || hasCoordinates) && (
              <TouchableOpacity onPress={handleClear} style={styles.iconButton}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={theme.textMuted}
                />
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      {/* Show coordinates if available */}
      {hasCoordinates && (
        <View style={styles.coordsRow}>
          <Ionicons name="checkmark-circle" size={14} color={theme.success} />
          <Text style={styles.coordsText}>
            {latitude?.toFixed(5)}, {longitude?.toFixed(5)}
          </Text>
        </View>
      )}
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>) {
  return StyleSheet.create({
    container: {
      gap: spacing.xs,
    },
    inputRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    inputWrapper: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.backgroundSecondary,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: spacing.sm,
    },
    inputIcon: {
      marginRight: spacing.xs,
    },
    input: {
      flex: 1,
      paddingVertical: spacing.sm,
      fontSize: fontSize.md,
      fontFamily: fonts.body,
      color: theme.text,
    },
    iconButton: {
      padding: spacing.sm,
    },
    coordsRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      paddingLeft: spacing.xs,
    },
    coordsText: {
      fontSize: fontSize.xs,
      fontFamily: fonts.body,
      color: theme.textMuted,
    },
  });
}
