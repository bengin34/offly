import type { ParsedLocation } from "../types";

/**
 * Parses Google Maps and Apple Maps URLs to extract coordinates and place names
 * Supports:
 * - https://maps.google.com/?q=lat,lng
 * - https://www.google.com/maps/place/Place+Name/@lat,lng,zoom
 * - https://maps.apple.com/?ll=lat,lng&q=Place+Name
 * - https://maps.apple.com/?address=Address
 */

// Regex patterns for different URL formats
const GOOGLE_MAPS_Q_PATTERN =
  /maps\.google\.com.*[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/i;
const GOOGLE_MAPS_PLACE_PATTERN =
  /google\.com\/maps\/place\/([^/@]+)\/@(-?\d+\.?\d*),(-?\d+\.?\d*)/i;
const GOOGLE_MAPS_AT_PATTERN =
  /google\.com\/maps\/@(-?\d+\.?\d*),(-?\d+\.?\d*)/i;
const APPLE_MAPS_LL_PATTERN =
  /maps\.apple\.com.*[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/i;
const APPLE_MAPS_Q_PATTERN = /maps\.apple\.com.*[?&]q=([^&]+)/i;
const APPLE_MAPS_ADDRESS_PATTERN = /maps\.apple\.com.*[?&]address=([^&]+)/i;

// Detect if URL is a short link that needs expansion
const SHORT_LINK_PATTERNS = [/maps\.app\.goo\.gl\//i, /goo\.gl\/maps\//i];

export function isMapUrl(url: string): boolean {
  const lowerUrl = url.toLowerCase();
  return (
    lowerUrl.includes("maps.google.com") ||
    lowerUrl.includes("google.com/maps") ||
    lowerUrl.includes("maps.apple.com") ||
    lowerUrl.includes("maps.app.goo.gl") ||
    lowerUrl.includes("goo.gl/maps")
  );
}

export function isShortMapUrl(url: string): boolean {
  return SHORT_LINK_PATTERNS.some((pattern) => pattern.test(url));
}

export function parseMapUrl(url: string): ParsedLocation | null {
  if (!url || typeof url !== "string") {
    return null;
  }

  const trimmedUrl = url.trim();

  // Check if it's a short link - these require network expansion
  if (isShortMapUrl(trimmedUrl)) {
    return {
      originalUrl: trimmedUrl,
      // Coordinates will be extracted after URL expansion
    };
  }

  // Try Google Maps ?q=lat,lng format
  let match = trimmedUrl.match(GOOGLE_MAPS_Q_PATTERN);
  if (match) {
    return {
      latitude: parseFloat(match[1]),
      longitude: parseFloat(match[2]),
      originalUrl: trimmedUrl,
    };
  }

  // Try Google Maps /place/Name/@lat,lng format
  match = trimmedUrl.match(GOOGLE_MAPS_PLACE_PATTERN);
  if (match) {
    const placeName = decodeURIComponent(match[1].replace(/\+/g, " "));
    return {
      name: placeName,
      latitude: parseFloat(match[2]),
      longitude: parseFloat(match[3]),
      originalUrl: trimmedUrl,
    };
  }

  // Try Google Maps /@lat,lng format
  match = trimmedUrl.match(GOOGLE_MAPS_AT_PATTERN);
  if (match) {
    return {
      latitude: parseFloat(match[1]),
      longitude: parseFloat(match[2]),
      originalUrl: trimmedUrl,
    };
  }

  // Try Apple Maps ?ll=lat,lng format
  match = trimmedUrl.match(APPLE_MAPS_LL_PATTERN);
  if (match) {
    const result: ParsedLocation = {
      latitude: parseFloat(match[1]),
      longitude: parseFloat(match[2]),
      originalUrl: trimmedUrl,
    };

    // Also extract place name if present
    const nameMatch = trimmedUrl.match(APPLE_MAPS_Q_PATTERN);
    if (nameMatch) {
      result.name = decodeURIComponent(nameMatch[1].replace(/\+/g, " "));
    }

    return result;
  }

  // Try Apple Maps ?address= format (no coordinates, just name)
  match = trimmedUrl.match(APPLE_MAPS_ADDRESS_PATTERN);
  if (match) {
    return {
      name: decodeURIComponent(match[1].replace(/\+/g, " ")),
      originalUrl: trimmedUrl,
    };
  }

  return null;
}

/**
 * Expands short URLs (goo.gl, maps.app.goo.gl) to full URLs
 * Note: This requires network access
 */
export async function expandShortUrl(shortUrl: string): Promise<string> {
  try {
    // Follow redirects to get the final URL
    const response = await fetch(shortUrl, {
      method: "HEAD",
      redirect: "follow",
    });
    return response.url;
  } catch (error) {
    console.error("Failed to expand short URL:", error);
    // Return original URL if expansion fails
    return shortUrl;
  }
}

/**
 * Full parsing flow including short URL expansion
 */
export async function parseMapUrlWithExpansion(
  url: string
): Promise<ParsedLocation | null> {
  if (!url) return null;

  let finalUrl = url.trim();

  // Expand short URLs if needed
  if (isShortMapUrl(finalUrl)) {
    finalUrl = await expandShortUrl(finalUrl);
  }

  return parseMapUrl(finalUrl);
}

/**
 * Validates coordinates are within valid ranges
 */
export function isValidCoordinates(lat?: number, lng?: number): boolean {
  if (lat === undefined || lng === undefined) return false;
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}
