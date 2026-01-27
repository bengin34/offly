import { TripRepository } from "../../src/db/repositories/TripRepository";
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

beforeEach(() => {
  mockDb = new FakeDb();
  mockUuidCounter = 0;
});

test("updates trip tags by replacing previous tag links", async () => {
  const trip = await TripRepository.create({
    title: "Original",
    startDate: "2025-01-01",
    endDate: "2025-01-02",
    location: "Berlin",
    tagIds: ["tag-old"],
  });

  const updated = await TripRepository.update({
    id: trip.id,
    tagIds: ["tag-new-1", "tag-new-2"],
  });

  expect(updated?.id).toBe(trip.id);
  expect(Array.from(mockDb.tripTags)).toEqual([
    `${trip.id}::tag-new-1`,
    `${trip.id}::tag-new-2`,
  ]);
});
