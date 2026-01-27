import { importFromJson } from "../../src/utils/import";
import { FakeDb } from "../helpers/fakeDb";

let mockDb: FakeDb;

jest.mock("../../src/db/database", () => ({
  getDatabase: jest.fn(async () => mockDb),
  getTimestamp: jest.fn(() => "2025-01-01T00:00:00.000Z"),
}));

function setMockFile(uri: string, data: unknown): void {
  const store = (global as { __mockFiles?: Map<string, string> }).__mockFiles;
  if (!store) throw new Error("Mock file store not initialized");
  store.set(uri, JSON.stringify(data));
}

beforeEach(() => {
  mockDb = new FakeDb();
  const store = (global as { __mockFiles?: Map<string, string> }).__mockFiles;
  store?.clear();
});

test("imports data and skips duplicate ids by default", async () => {
  mockDb.tags.set("tag-1", { id: "tag-1", name: "Food" });
  mockDb.trips.set("trip-1", {
    id: "trip-1",
    title: "Existing Trip",
    start_date: "2024-01-01",
    end_date: "2024-01-05",
    location: "Rome",
    summary: null,
    cover_image_uri: null,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  });
  mockDb.entries.set("entry-1", {
    id: "entry-1",
    trip_id: "trip-1",
    city_id: null,
    entry_type: "place",
    title: "Colosseum",
    notes: null,
    rating: 5,
    date: "2024-01-02",
    location_name: null,
    latitude: null,
    longitude: null,
    map_url: null,
    created_at: "2024-01-02T00:00:00.000Z",
    updated_at: "2024-01-02T00:00:00.000Z",
  });

  const fileUri = "file://import-duplicates.json";
  setMockFile(fileUri, {
    version: "1.0.0",
    exportedAt: "2025-01-01T00:00:00.000Z",
    tags: [
      { id: "tag-1", name: "Food" },
      { id: "tag-2", name: "Museums" },
    ],
    trips: [
      {
        id: "trip-1",
        title: "Existing Trip",
        startDate: "2024-01-01",
        endDate: "2024-01-05",
        location: "Rome",
        summary: null,
        coverImageUri: null,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
        tags: [{ id: "tag-1", name: "Food" }],
        entries: [
          {
            id: "entry-1",
            tripId: "trip-1",
            cityId: null,
            entryType: "place",
            title: "Colosseum",
            notes: null,
            rating: 5,
            date: "2024-01-02",
            createdAt: "2024-01-02T00:00:00.000Z",
            updatedAt: "2024-01-02T00:00:00.000Z",
            tags: [],
            photos: [],
          },
          {
            id: "entry-2",
            tripId: "trip-1",
            cityId: null,
            entryType: "moment",
            title: "Gelato",
            notes: "Late night",
            rating: 4,
            date: "2024-01-03",
            createdAt: "2024-01-03T00:00:00.000Z",
            updatedAt: "2024-01-03T00:00:00.000Z",
            tags: [],
            photos: [],
          },
        ],
      },
    ],
  });

  const result = await importFromJson(fileUri);

  expect(result.success).toBe(true);
  expect(result.tagsImported).toBe(1);
  expect(result.skipped.tags).toBe(1);
  expect(result.tripsImported).toBe(0);
  expect(result.skipped.trips).toBe(1);
  expect(result.entriesImported).toBe(1);
  expect(result.skipped.entries).toBe(1);
  expect(mockDb.entries.has("entry-2")).toBe(true);
});

test("handles large trips, long titles, and many photos", async () => {
  const longTitle = "Summer Roadtrip ".repeat(8).trim();
  const entries = Array.from({ length: 50 }, (_, index) => {
    const photos = Array.from({ length: 10 }, (__, photoIndex) => ({
      id: `photo-${index}-${photoIndex}`,
      uri: `file:///photo-${index}-${photoIndex}.jpg`,
      orderIndex: photoIndex,
    }));

    return {
      id: `entry-${index}`,
      tripId: "trip-big",
      cityId: null,
      entryType: index % 2 === 0 ? "place" : "moment",
      title: `Entry ${index}`,
      notes: index % 3 === 0 ? "Notes" : null,
      rating: index % 5,
      date: "2024-07-15",
      createdAt: "2024-07-15T00:00:00.000Z",
      updatedAt: "2024-07-15T00:00:00.000Z",
      tags: [],
      photos,
    };
  });

  const fileUri = "file://import-large.json";
  setMockFile(fileUri, {
    version: "1.0.0",
    exportedAt: "2025-01-01T00:00:00.000Z",
    tags: [],
    trips: [
      {
        id: "trip-big",
        title: longTitle,
        startDate: "2024-06-15",
        endDate: "2024-08-02",
        location: "USA",
        summary: "Spanning multiple months",
        coverImageUri: null,
        createdAt: "2024-06-15T00:00:00.000Z",
        updatedAt: "2024-06-15T00:00:00.000Z",
        tags: [],
        entries,
      },
    ],
  });

  const result = await importFromJson(fileUri);

  expect(result.success).toBe(true);
  expect(result.tripsImported).toBe(1);
  expect(result.entriesImported).toBe(50);
  expect(result.photosImported).toBe(500);
  expect(mockDb.trips.get("trip-big")?.title).toBe(longTitle);
  expect(mockDb.trips.get("trip-big")?.start_date).toBe("2024-06-15");
  expect(mockDb.trips.get("trip-big")?.end_date).toBe("2024-08-02");
});
