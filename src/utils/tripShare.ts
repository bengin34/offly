import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import { format } from "date-fns";
import { EntryRepository, TripRepository } from "../db/repositories";
import { CityRepository } from "../db/repositories/CityRepository";
import { translate } from "../localization";
import { useLocaleStore } from "../stores/localeStore";
import type { City, EntryWithRelations, Trip } from "../types";
import type { ShareFormat } from "./cityShare";

export interface TripShareData {
  trip: Trip;
  cities: City[];
  entries: EntryWithRelations[];
}

const getLocale = () => useLocaleStore.getState().locale;
const t = (key: string, params?: Record<string, string | number>) =>
  translate(getLocale(), key, params);

function groupEntriesByType(entries: EntryWithRelations[]) {
  const places = entries.filter((e) => e.entryType === "place");
  const moments = entries.filter((e) => e.entryType === "moment");
  return { places, moments };
}

function formatRating(rating?: number): string {
  if (!rating) return "";
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

function formatTripRange(trip: Trip): string {
  if (!trip.startDate || !trip.endDate) return "";
  return `${format(new Date(trip.startDate), "MMM d")} - ${format(new Date(trip.endDate), "MMM d, yyyy")}`;
}

function getImageMimeType(uri: string): string {
  const lower = uri.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".heic") || lower.endsWith(".heif")) return "image/heic";
  return "image/jpeg";
}

async function getTripCoverDataUri(trip: Trip): Promise<string | null> {
  if (!trip.coverImageUri) return null;
  try {
    const base64 = await new File(trip.coverImageUri).base64();
    return `data:${getImageMimeType(trip.coverImageUri)};base64,${base64}`;
  } catch (error) {
    console.warn("Failed to load trip cover image:", error);
    return null;
  }
}

function groupEntriesByCity(entries: EntryWithRelations[]) {
  const byCity = new Map<string, EntryWithRelations[]>();
  const uncategorized: EntryWithRelations[] = [];
  for (const entry of entries) {
    if (entry.cityId) {
      const list = byCity.get(entry.cityId) ?? [];
      list.push(entry);
      byCity.set(entry.cityId, list);
    } else {
      uncategorized.push(entry);
    }
  }
  return { byCity, uncategorized };
}

export function generateTripTextList(data: TripShareData): string {
  const { trip, cities, entries } = data;
  const { byCity, uncategorized } = groupEntriesByCity(entries);
  const sortedCities = [...cities].sort((a, b) => a.orderIndex - b.orderIndex);
  const dateRange = formatTripRange(trip);

  const lines: string[] = [];
  lines.push(`✈️ ${trip.title}`);
  if (dateRange) {
    lines.push(dateRange);
  }
  if (trip.location) {
    lines.push(`${t("shareContent.locationLabel")}: ${trip.location}`);
  }
  if (trip.summary) {
    lines.push(`${t("shareContent.summaryLabel")}: ${trip.summary}`);
  }
  lines.push("");

  for (const city of sortedCities) {
    lines.push(`📍 ${city.name}`);
    if (city.arrivalDate || city.departureDate) {
      const arrival = city.arrivalDate
        ? format(new Date(city.arrivalDate), "MMM d")
        : "?";
      const departure = city.departureDate
        ? format(new Date(city.departureDate), "MMM d, yyyy")
        : "?";
      lines.push(`  ${arrival} - ${departure}`);
    }
    const cityEntries = byCity.get(city.id) ?? [];
    if (cityEntries.length === 0) {
      lines.push(`  • ${t("shareContent.noEntries")}`);
    } else {
      for (const entry of cityEntries) {
        let line = `  • ${entry.title}`;
        if (entry.rating) {
          line += ` ${formatRating(entry.rating)}`;
        }
        lines.push(line);
        if (entry.notes) {
          lines.push(`    "${entry.notes}"`);
        }
      }
    }
    lines.push("");
  }

  if (uncategorized.length > 0) {
    lines.push(`❓ ${t("shareContent.otherEntries")}`);
    for (const entry of uncategorized) {
      let line = `  • ${entry.title}`;
      if (entry.rating) {
        line += ` ${formatRating(entry.rating)}`;
      }
      lines.push(line);
      if (entry.notes) {
        lines.push(`    "${entry.notes}"`);
      }
    }
    lines.push("");
  }

  lines.push("───────────────");
  lines.push(t("shareContent.sharedFrom"));

  return lines.join("\n");
}

export async function shareAsText(data: TripShareData): Promise<void> {
  const text = generateTripTextList(data);
  const filename = `${data.trip.title.replace(/\s+/g, "_")}_trip.txt`;
  const file = new File(Paths.cache, filename);

  await file.write(text);

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(file.uri, {
      mimeType: "text/plain",
      dialogTitle: t("shareDialog.dialogTitleTrip", { name: data.trip.title }),
    });
  }
}

function generateTripPdfHtml(data: TripShareData): string {
  const { trip, cities, entries } = data;
  const { byCity, uncategorized } = groupEntriesByCity(entries);
  const sortedCities = [...cities].sort((a, b) => a.orderIndex - b.orderIndex);
  const dateRange = formatTripRange(trip);

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
        .trip-name {
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
        .trip-meta {
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
          margin-bottom: 12px;
        }
        .entry {
          margin-bottom: 12px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 8px;
        }
        .entry-title {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 4px;
        }
        .entry-notes {
          font-size: 13px;
          color: #4b5563;
        }
        .entry-rating {
          color: #f59e0b;
          font-size: 12px;
          margin-left: 6px;
        }
        .city-label {
          font-size: 16px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #111827;
        }
        .city-dates {
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="trip-name">${trip.title}</div>
        ${dateRange ? `<div class="date-range">${dateRange}</div>` : ""}
        ${trip.location ? `<div class="trip-meta">${trip.location}</div>` : ""}
        ${trip.summary ? `<div class="trip-meta">${trip.summary}</div>` : ""}
      </div>
  `;

  for (const city of sortedCities) {
    const cityEntries = byCity.get(city.id) ?? [];
    const arrival = city.arrivalDate
      ? format(new Date(city.arrivalDate), "MMM d")
      : "?";
    const departure = city.departureDate
      ? format(new Date(city.departureDate), "MMM d, yyyy")
      : "?";

    html += `
      <div class="section">
        <div class="city-label">📍 ${city.name}</div>
        ${(city.arrivalDate || city.departureDate) ? `<div class="city-dates">${arrival} - ${departure}</div>` : ""}
    `;

    if (cityEntries.length === 0) {
      html += `<div class="entry"><div class="entry-title">${t("shareContent.noEntries")}</div></div>`;
    } else {
      for (const entry of cityEntries) {
        const rating = entry.rating ? `<span class="entry-rating">${formatRating(entry.rating)}</span>` : "";
        html += `
          <div class="entry">
            <div class="entry-title">${entry.title}${rating}</div>
            ${entry.notes ? `<div class="entry-notes">${entry.notes}</div>` : ""}
          </div>
        `;
      }
    }
    html += `</div>`;
  }

  if (uncategorized.length > 0) {
    html += `
      <div class="section">
        <div class="section-title">${t("shareContent.otherEntries")}</div>
    `;
    for (const entry of uncategorized) {
      const rating = entry.rating ? `<span class="entry-rating">${formatRating(entry.rating)}</span>` : "";
      html += `
        <div class="entry">
          <div class="entry-title">${entry.title}${rating}</div>
          ${entry.notes ? `<div class="entry-notes">${entry.notes}</div>` : ""}
        </div>
      `;
    }
    html += `</div>`;
  }

  html += `
    </body>
    </html>
  `;

  return html;
}

export async function shareAsPdf(data: TripShareData): Promise<void> {
  const html = generateTripPdfHtml(data);
  const { uri } = await Print.printToFileAsync({
    html,
    base64: false,
  });

  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(uri, {
      mimeType: "application/pdf",
      dialogTitle: t("shareDialog.dialogTitleTrip", { name: data.trip.title }),
      UTI: "com.adobe.pdf",
    });
  }
}

async function generateImageCardHtml(data: TripShareData): Promise<string> {
  const { trip, entries, cities } = data;
  const { places, moments } = groupEntriesByType(entries);
  const dateRange = formatTripRange(trip);
  const coverImage = await getTripCoverDataUri(trip);
  const topEntries = [...entries].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 8);

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
          background: linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%);
          display: flex;
          justify-content: center;
        }
        .card {
          padding: 28px;
          color: white;
          width: 100%;
        }
        .hero {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 16px;
          margin-bottom: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 2px;
          opacity: 0.8;
          margin-bottom: 8px;
        }
        .trip-name {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 6px;
        }
        .date-range {
          font-size: 13px;
          opacity: 0.9;
        }
        .divider {
          height: 1px;
          background: rgba(255,255,255,0.3);
          margin: 16px 0;
        }
        .stats {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 16px;
        }
        .stat {
          text-align: center;
        }
        .stat-value {
          font-size: 20px;
          font-weight: 700;
        }
        .stat-label {
          font-size: 11px;
          opacity: 0.8;
          text-transform: uppercase;
        }
        .entries {
          margin-bottom: 20px;
        }
        .entry {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          padding: 10px 12px;
          background: rgba(255,255,255,0.14);
          border-radius: 10px;
        }
        .entry-icon {
          margin-right: 10px;
          font-size: 15px;
        }
        .entry-content {
          flex: 1;
        }
        .entry-title {
          font-size: 13px;
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
          <div class="label">${t("shareContent.tripHighlights")}</div>
          <div class="trip-name">${trip.title}</div>
          ${dateRange ? `<div class="date-range">${dateRange}</div>` : ""}
        </div>

        <div class="stats">
          <div class="stat">
            <div class="stat-value">${cities.length}</div>
            <div class="stat-label">${t("shareContent.cities")}</div>
          </div>
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
    const meta = entry.city?.name ? entry.city.name : "";

    html += `
      <div class="entry">
        <span class="entry-icon">${icon}</span>
        <div class="entry-content">
          <div class="entry-title">${entry.title} ${rating}</div>
          ${meta ? `<div class="entry-meta">${meta}</div>` : ""}
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
          ${trip.title} • VoyageLog
        </div>
      </div>
    </body>
    </html>
  `;

  return html;
}

export async function shareAsImage(data: TripShareData): Promise<void> {
  const html = await generateImageCardHtml(data);
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
      dialogTitle: t("shareDialog.dialogTitleCard", { name: data.trip.title }),
    });
  }
}

export async function getTripShareData(tripId: string): Promise<TripShareData> {
  const trip = await TripRepository.getById(tripId);
  if (!trip) {
    throw new Error("Trip not found");
  }

  const [entries, cities] = await Promise.all([
    EntryRepository.getByTripIdWithRelations(tripId),
    CityRepository.getByTripId(tripId),
  ]);

  return {
    trip,
    cities,
    entries,
  };
}

export async function shareTrip(data: TripShareData, format: ShareFormat): Promise<void> {
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
