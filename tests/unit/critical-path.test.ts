import { TripRepository } from "../../src/db/repositories/TripRepository";
import { EntryRepository } from "../../src/db/repositories/EntryRepository";
import { FakeDb } from "../helpers/fakeDb";

let mockDb: FakeDb;
let mockUuidCounter = 0;

jest.mock("../../src/db/database", () => ({
  getDatabase: jest.fn(async () => mockDb),
  getTimestamp: jest.fn(() => "2025-01-01T00:00:00.000Z"),
}));

jest.mock("../../src/utils/uuid", () => ({
  generateUUID: jest.fn(() => {
    mockUuidCounter += 1;
    return `uuid-${mockUuidCounter}`;
  }),
}));

jest.mock("../../src/utils/photos", () => ({
  persistPhotos: jest.fn(async (uris: string[]) =>
    uris.map((uri) => `persisted:${uri}`),
  ),
  deletePhotoFiles: jest.fn(async () => undefined),
  deletePhotoFile: jest.fn(async () => undefined),
}));

const mockPhotos = jest.requireMock("../../src/utils/photos") as {
  persistPhotos: jest.Mock;
  deletePhotoFiles: jest.Mock;
  deletePhotoFile: jest.Mock;
};

beforeEach(() => {
  mockDb = new FakeDb();
  mockUuidCounter = 0;
  mockPhotos.persistPhotos.mockClear();
  mockPhotos.deletePhotoFiles.mockClear();
  mockPhotos.deletePhotoFile.mockClear();
});

test("critical path: create trip, add entry with photos, view, delete entry and trip", async () => {
  const trip = await TripRepository.create({
    title: "Weekend Getaway",
    startDate: "2025-01-10",
    endDate: "2025-01-12",
    location: "Lisbon",
  });

  const entry = await EntryRepository.create({
    tripId: trip.id,
    entryType: "place",
    title: "Time Out Market",
    notes: "Great food",
    rating: 5,
    date: "2025-01-11",
    photoUris: ["file:///photo-1.jpg", "file:///photo-2.jpg"],
  });

  const fetchedTrip = await TripRepository.getById(trip.id);
  const fetchedEntry = await EntryRepository.getWithRelations(entry.id);

  expect(fetchedTrip?.title).toBe("Weekend Getaway");
  expect(fetchedEntry?.title).toBe("Time Out Market");
  expect(fetchedEntry?.photos).toHaveLength(2);
  expect(fetchedEntry?.photos[0].uri).toBe("persisted:file:///photo-1.jpg");

  const entryDeleted = await EntryRepository.delete(entry.id);
  const tripDeleted = await TripRepository.delete(trip.id);

  expect(entryDeleted).toBe(true);
  expect(tripDeleted).toBe(true);
  expect(mockDb.entries.has(entry.id)).toBe(false);
  expect(mockDb.trips.has(trip.id)).toBe(false);
});
