import { Platform, Linking } from "react-native";

export interface OpenMapOptions {
  latitude?: number;
  longitude?: number;
  locationName?: string;
  originalUrl?: string;
}

/**
 * Opens a location in the device's default maps app
 * iOS: Prefers Apple Maps
 * Android: Prefers Google Maps
 */
export async function openInMaps(options: OpenMapOptions): Promise<boolean> {
  const { latitude, longitude, locationName, originalUrl } = options;

  // If we have the original URL, try opening it directly first
  if (originalUrl) {
    try {
      const canOpen = await Linking.canOpenURL(originalUrl);
      if (canOpen) {
        await Linking.openURL(originalUrl);
        return true;
      }
    } catch (error) {
      // Original URL couldn't be opened, falling back to coordinates
    }
  }

  // If we have coordinates, construct a native maps URL
  if (latitude !== undefined && longitude !== undefined) {
    let mapUrl: string;

    if (Platform.OS === "ios") {
      // Apple Maps URL scheme
      const query = locationName
        ? `&q=${encodeURIComponent(locationName)}`
        : "";
      mapUrl = `maps:?ll=${latitude},${longitude}${query}`;
    } else {
      // Google Maps URL for Android
      const query = locationName
        ? `(${encodeURIComponent(locationName)})`
        : "";
      mapUrl = `geo:${latitude},${longitude}?q=${latitude},${longitude}${query}`;
    }

    try {
      const canOpen = await Linking.canOpenURL(mapUrl);
      if (canOpen) {
        await Linking.openURL(mapUrl);
        return true;
      }

      // Fallback to web URL if native scheme fails
      const webUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      await Linking.openURL(webUrl);
      return true;
    } catch (error) {
      console.error("Failed to open maps:", error);
      return false;
    }
  }

  // If we only have a location name, search for it
  if (locationName) {
    const searchQuery = encodeURIComponent(locationName);
    let mapUrl: string;

    if (Platform.OS === "ios") {
      mapUrl = `maps:?q=${searchQuery}`;
    } else {
      mapUrl = `geo:0,0?q=${searchQuery}`;
    }

    try {
      const canOpen = await Linking.canOpenURL(mapUrl);
      if (canOpen) {
        await Linking.openURL(mapUrl);
        return true;
      }

      // Fallback to web
      const webUrl = `https://www.google.com/maps/search/${searchQuery}`;
      await Linking.openURL(webUrl);
      return true;
    } catch (error) {
      console.error("Failed to open maps:", error);
      return false;
    }
  }

  return false;
}
