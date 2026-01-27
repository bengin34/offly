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

test("updates entry photos and deletes removed files", async () => {
  const trip = await TripRepository.create({
    title: "Photo Trip",
    startDate: "2025-02-01",
    endDate: "2025-02-02",
    location: "Rome",
  });

  const entry = await EntryRepository.create({
    tripId: trip.id,
    entryType: "place",
    title: "Pantheon",
    date: "2025-02-01",
    photoUris: ["file:///a.jpg", "file:///b.jpg"],
  });

  await EntryRepository.update({
    id: entry.id,
    photoUris: ["file:///b.jpg", "file:///c.jpg"],
  });

  expect(mockPhotos.deletePhotoFiles).toHaveBeenCalledWith([
    "persisted:file:///a.jpg",
  ]);

  const storedPhotos = Array.from(mockDb.entryPhotos.values()).filter(
    (photo) => photo.entry_id === entry.id,
  );
  const storedUris = storedPhotos.map((photo) => photo.uri).sort();

  expect(storedUris).toEqual([
    "persisted:file:///b.jpg",
    "persisted:file:///c.jpg",
  ]);
});
