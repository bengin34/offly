import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import { format } from "date-fns";
import { EntryRepository } from "../db/repositories";
import { CityRepository } from "../db/repositories/CityRepository";
import { translate } from "../localization";
import { useLocaleStore } from "../stores/localeStore";
import type { City, EntryWithRelations, Trip } from "../types";

export type ShareFormat = "text" | "image" | "pdf";

export interface CityShareData {
  city: City;
  trip: Trip;
  entries: EntryWithRelations[];
}

const getLocale = () => useLocaleStore.getState().locale;
const t = (key: string, params?: Record<string, string | number>) =>
  translate(getLocale(), key, params);

// Group entries by type for display
function groupEntriesByType(entries: EntryWithRelations[]) {
  const places = entries.filter((e) => e.entryType === "place");
  const moments = entries.filter((e) => e.entryType === "moment");
  return { places, moments };
}

// Group places by their tags for categorization (cafes, restaurants, etc.)
function groupPlacesByCategory(places: EntryWithRelations[]) {
  const categories: Record<string, EntryWithRelations[]> = {};
  const uncategorized: EntryWithRelations[] = [];

  for (const place of places) {
    if (place.tags.length > 0) {
      // Use first tag as primary category
      const category = place.tags[0].name;
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(place);
    } else {
      uncategorized.push(place);
    }
  }

  return { categories, uncategorized };
}

// Format rating as stars
function formatRating(rating?: number): string {
  if (!rating) return "";
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

function getImageMimeType(uri: string): string {
  const lower = uri.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".heic") || lower.endsWith(".heif")) return "image/heic";
  return "image/jpeg";
}

async function getFirstPhotoDataUri(entries: EntryWithRelations[]): Promise<string | null> {
  const entryWithPhoto = entries.find((entry) => entry.photos.length > 0);
  const photoUri = entryWithPhoto?.photos[0]?.uri;
  if (!photoUri) return null;

  try {
    const base64 = await new File(photoUri).base64();
    return `data:${getImageMimeType(photoUri)};base64,${base64}`;
  } catch (error) {
    console.warn("Failed to load city share photo:", error);
    return null;
  }
}

// ============================================
// TEXT LIST FORMAT
// ============================================

export function generateTextList(data: CityShareData): string {
  const { city, trip, entries } = data;
  const { places, moments } = groupEntriesByType(entries);
  const { categories, uncategorized } = groupPlacesByCategory(places);

  const lines: string[] = [];

  // Header
  lines.push(`📍 ${city.name}`);
  if (city.arrivalDate && city.departureDate) {
    lines.push(
      `${format(new Date(city.arrivalDate), "MMM d")} - ${format(new Date(city.departureDate), "MMM d, yyyy")}`
    );
  }
  lines.push(`${t("shareContent.fromTrip")}: ${trip.title}`);
  lines.push("");

  // Places by category
  if (Object.keys(categories).length > 0 || uncategorized.length > 0) {
    lines.push(`═══ ${t("shareContent.placesSection")} ═══`);
    lines.push("");

    // Categorized places
    for (const [category, categoryPlaces] of Object.entries(categories)) {
      lines.push(`▸ ${category.toUpperCase()}`);
      for (const place of categoryPlaces) {
        let line = `  • ${place.title}`;
        if (place.rating) {
          line += ` ${formatRating(place.rating)}`;
        }
        lines.push(line);
        if (place.notes) {
          lines.push(`    "${place.notes}"`);
        }
      }
      lines.push("");
    }

    // Uncategorized places
    if (uncategorized.length > 0) {
      lines.push(`▸ ${t("shareContent.otherPlaces")}`);
      for (const place of uncategorized) {
        let line = `  • ${place.title}`;
        if (place.rating) {
          line += ` ${formatRating(place.rating)}`;
        }
        lines.push(line);
        if (place.notes) {
          lines.push(`    "${place.notes}"`);
        }
      }
      lines.push("");
    }
  }

  // Moments
  if (moments.length > 0) {
    lines.push(`═══ ${t("shareContent.momentsSection")} ═══`);
    lines.push("");
    for (const moment of moments) {
      lines.push(`  ✦ ${moment.title}`);
      if (moment.notes) {
        lines.push(`    "${moment.notes}"`);
      }
    }
    lines.push("");
  }

  // Footer
  lines.push("───────────────");
  lines.push(t("shareContent.sharedFrom"));

  return lines.join("\n");
}

export async function shareAsText(data: CityShareData): Promise<void> {
  const text = generateTextList(data);
  const filename = `${data.city.name.replace(/\s+/g, "_")}_recommendations.txt`;
  const file = new File(Paths.cache, filename);

  await file.write(text);

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(file.uri, {
      mimeType: "text/plain",
      dialogTitle: t("shareDialog.dialogTitleCityRecommendations", { name: data.city.name }),
    });
  }
}

// ============================================
// PDF FORMAT
// ============================================

function generatePdfHtml(data: CityShareData): string {
  const { city, trip, entries } = data;
  const { places, moments } = groupEntriesByType(entries);
  const { categories, uncategorized } = groupPlacesByCategory(places);

  const dateRange =
    city.arrivalDate && city.departureDate
      ? `${format(new Date(city.arrivalDate), "MMM d")} - ${format(new Date(city.departureDate), "MMM d, yyyy")}`
      : "";

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 40px;
          color: #1a1a1a;
          line-height: 1.5;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e0e0e0;
        }
        .city-name {
          font-size: 32px;
          font-weight: 700;
          color: #2563eb;
          margin-bottom: 8px;
        }
        .date-range {
          font-size: 16px;
          color: #666;
          margin-bottom: 4px;
        }
        .trip-name {
          font-size: 14px;
          color: #888;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e5e7eb;
        }
        .category {
          margin-bottom: 20px;
        }
        .category-name {
          font-size: 14px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 10px;
        }
        .entry {
          margin-bottom: 12px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 8px;
        }
        .entry-title {
          font-size: 16px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .rating {
          color: #f59e0b;
          font-size: 14px;
        }
        .entry-notes {
          font-size: 14px;
          color: #6b7280;
          margin-top: 6px;
          font-style: italic;
        }
        .entry-tags {
          margin-top: 6px;
        }
        .tag {
          display: inline-block;
          padding: 2px 8px;
          background: #e0e7ff;
          color: #4338ca;
          border-radius: 12px;
          font-size: 12px;
          margin-right: 4px;
        }
        .photos {
          margin-top: 10px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .photo {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 8px;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
          text-align: center;
          font-size: 12px;
          color: #9ca3af;
        }
        .moment-icon { color: #8b5cf6; }
        .place-icon { color: #2563eb; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="city-name">${city.name}</div>
        ${dateRange ? `<div class="date-range">${dateRange}</div>` : ""}
        <div class="trip-name">${t("shareContent.from")}: ${trip.title}</div>
      </div>
  `;

  // Places section
  if (Object.keys(categories).length > 0 || uncategorized.length > 0) {
    html += `<div class="section"><div class="section-title">📍 ${t("shareContent.places")}</div>`;

    for (const [category, categoryPlaces] of Object.entries(categories)) {
      html += `<div class="category"><div class="category-name">${category}</div>`;
      for (const place of categoryPlaces) {
        html += renderEntryHtml(place);
      }
      html += `</div>`;
    }

    if (uncategorized.length > 0) {
      html += `<div class="category"><div class="category-name">${t("shareContent.other")}</div>`;
      for (const place of uncategorized) {
        html += renderEntryHtml(place);
      }
      html += `</div>`;
    }

    html += `</div>`;
  }

  // Moments section
  if (moments.length > 0) {
    html += `<div class="section"><div class="section-title">✦ ${t("shareContent.moments")}</div>`;
    for (const moment of moments) {
      html += renderEntryHtml(moment);
    }
    html += `</div>`;
  }

  html += `
      <div class="footer">
        ${t("shareContent.sharedFrom")}
      </div>
    </body>
    </html>
  `;

  return html;
}

function renderEntryHtml(entry: EntryWithRelations): string {
  const ratingHtml = entry.rating
    ? `<span class="rating">${"★".repeat(entry.rating)}${"☆".repeat(5 - entry.rating)}</span>`
    : "";

  const tagsHtml =
    entry.tags.length > 0
      ? `<div class="entry-tags">${entry.tags.map((t) => `<span class="tag">${t.name}</span>`).join("")}</div>`
      : "";

  const notesHtml = entry.notes
    ? `<div class="entry-notes">"${entry.notes}"</div>`
    : "";

  // Note: Photos in PDF would need base64 encoding to work properly
  // For now we skip photos in PDF to keep it simple

  return `
    <div class="entry">
      <div class="entry-title">
        ${entry.title}
        ${ratingHtml}
      </div>
      ${notesHtml}
      ${tagsHtml}
    </div>
  `;
}

export async function shareAsPdf(data: CityShareData): Promise<void> {
  const html = generatePdfHtml(data);

  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
  });

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(uri, {
      mimeType: "application/pdf",
      dialogTitle: t("shareDialog.dialogTitleCityGuide", { name: data.city.name }),
      UTI: "com.adobe.pdf",
    });
  }
}

// ============================================
// IMAGE CARD FORMAT (HTML to Image via Print)
// ============================================

async function generateImageCardHtml(data: CityShareData): Promise<string> {
  const { city, trip, entries } = data;
  const { places, moments } = groupEntriesByType(entries);
  const { categories, uncategorized } = groupPlacesByCategory(places);
  const coverImage = await getFirstPhotoDataUri(entries);

  const dateRange =
    city.arrivalDate && city.departureDate
      ? `${format(new Date(city.arrivalDate), "MMM d")} - ${format(new Date(city.departureDate), "MMM d, yyyy")}`
      : "";

  // Collect top entries (max 8 for visual card)
  const topEntries = [...places, ...moments].slice(0, 8);

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          width: 400px;
          padding: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          justify-content: center;
        }
        .card {
          padding: 32px;
          color: white;
          width: 100%;
        }
        .header {
          text-align: center;
          margin-bottom: 24px;
        }
        .hero {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 16px;
          margin-bottom: 20px;
        }
        .label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 2px;
          opacity: 0.8;
          margin-bottom: 8px;
        }
        .city-name {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .date-range {
          font-size: 14px;
          opacity: 0.9;
        }
        .divider {
          height: 1px;
          background: rgba(255,255,255,0.3);
          margin: 20px 0;
        }
        .entries {
          margin-bottom: 24px;
        }
        .entry {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          padding: 10px 14px;
          background: rgba(255,255,255,0.15);
          border-radius: 10px;
        }
        .entry-icon {
          margin-right: 12px;
          font-size: 16px;
        }
        .entry-content {
          flex: 1;
        }
        .entry-title {
          font-size: 14px;
          font-weight: 500;
        }
        .entry-meta {
          font-size: 11px;
          opacity: 0.7;
          margin-top: 2px;
        }
        .rating {
          color: #fbbf24;
          font-size: 12px;
        }
        .stats {
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-bottom: 20px;
        }
        .stat {
          text-align: center;
        }
        .stat-value {
          font-size: 24px;
          font-weight: 700;
        }
        .stat-label {
          font-size: 11px;
          opacity: 0.8;
          text-transform: uppercase;
        }
        .footer {
          text-align: center;
          font-size: 11px;
          opacity: 0.6;
        }
      </style>
    </head>
    <body>
      <div class="card">
        ${coverImage ? `<img class="hero" src="${coverImage}" />` : ""}
        <div class="header">
          <div class="label">${t("shareContent.myRecommendations")}</div>
          <div class="city-name">${city.name}</div>
          ${dateRange ? `<div class="date-range">${dateRange}</div>` : ""}
        </div>

        <div class="stats">
          <div class="stat">
            <div class="stat-value">${places.length}</div>
            <div class="stat-label">${t("shareContent.places")}</div>
          </div>
          <div class="stat">
            <div class="stat-value">${moments.length}</div>
            <div class="stat-label">${t("shareContent.moments")}</div>
          </div>
        </div>

        <div class="divider"></div>

        <div class="entries">
  `;

  for (const entry of topEntries) {
    const icon = entry.entryType === "place" ? "📍" : "✦";
    const rating = entry.rating ? `<span class="rating">${"★".repeat(entry.rating)}</span>` : "";
    const tag = entry.tags.length > 0 ? entry.tags[0].name : "";

    html += `
      <div class="entry">
        <span class="entry-icon">${icon}</span>
        <div class="entry-content">
          <div class="entry-title">${entry.title} ${rating}</div>
          ${tag ? `<div class="entry-meta">${tag}</div>` : ""}
        </div>
      </div>
    `;
  }

  if (entries.length > 8) {
    html += `
      <div class="entry" style="justify-content: center; opacity: 0.7;">
        <span>${t("shareContent.moreItems", { count: entries.length - 8 })}</span>
      </div>
    `;
  }

  html += `
        </div>

        <div class="footer">
          ${t("shareContent.from")}: ${trip.title} • VoyageLog
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
}

export async function shareAsImage(data: CityShareData): Promise<void> {
  const html = await generateImageCardHtml(data);

  // Use expo-print to generate a PDF, then share
  // Note: For true image sharing, you'd use react-native-view-shot with a rendered view
  // This PDF approach creates a single-page shareable document that looks like an image card
  const { uri } = await Print.printToFileAsync({
    html,
    width: 400,
    height: 600,
    base64: false,
  });

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(uri, {
      mimeType: "application/pdf",
      dialogTitle: t("shareDialog.dialogTitleCard", { name: data.city.name }),
    });
  }
}

// ============================================
// MAIN SHARE FUNCTION
// ============================================

export async function getCityShareData(
  tripId: string,
  cityId: string,
  trip: Trip
): Promise<CityShareData> {
  const city = await CityRepository.getById(cityId);
  if (!city) {
    throw new Error("City not found");
  }

  const allEntries = await EntryRepository.getByTripIdWithRelations(tripId);
  const cityEntries = allEntries.filter((e) => e.cityId === cityId);

  return {
    city,
    trip,
    entries: cityEntries,
  };
}

export async function shareCity(
  data: CityShareData,
  format: ShareFormat
): Promise<void> {
  switch (format) {
    case "text":
      await shareAsText(data);
      break;
    case "image":
      await shareAsImage(data);
      break;
    case "pdf":
      await shareAsPdf(data);
      break;
  }
}
