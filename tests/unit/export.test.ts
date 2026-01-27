import { exportAllData } from "../../src/utils/export";

jest.mock("../../src/db/repositories", () => ({
  TripRepository: { getAll: jest.fn() },
  EntryRepository: { getByTripIdWithRelations: jest.fn() },
  TagRepository: { getAll: jest.fn(), getForTrip: jest.fn() },
}));

const mockRepositories = jest.requireMock("../../src/db/repositories") as {
  TripRepository: { getAll: jest.Mock };
  EntryRepository: { getByTripIdWithRelations: jest.Mock };
  TagRepository: { getAll: jest.Mock; getForTrip: jest.Mock };
};

const { TripRepository, EntryRepository, TagRepository } = mockRepositories;

afterEach(() => {
  jest.clearAllMocks();
});

test("exports trips with long titles, spanning dates, and many photos", async () => {
  const longTitle = "City Break (Special #1) ".repeat(6).trim();
  const trip = {
    id: "trip-100",
    title: longTitle,
    startDate: "2024-11-28",
    endDate: "2025-01-02",
    location: "Paris & Lyon",
    summary: "New Year stretch",
    coverImageUri: null,
    createdAt: "2024-11-28T00:00:00.000Z",
    updatedAt: "2024-11-28T00:00:00.000Z",
  };

  const tags = [
    { id: "tag-1", name: "Food" },
    { id: "tag-2", name: "Museums" },
  ];

  const photos = Array.from({ length: 10 }, (_, index) => ({
    id: `photo-${index}`,
    entryId: "entry-100",
    uri: `file:///photos/photo-${index}.jpg`,
    orderIndex: index,
  }));

  const entries = [
    {
      id: "entry-100",
      tripId: trip.id,
      cityId: null,
      entryType: "place",
      title: "Louvre",
      notes: "Loved it!",
      rating: 5,
      date: "2024-12-01",
      createdAt: "2024-12-01T00:00:00.000Z",
      updatedAt: "2024-12-01T00:00:00.000Z",
      tags,
      photos,
    },
  ];

  TripRepository.getAll.mockResolvedValue([trip]);
  TagRepository.getAll.mockResolvedValue(tags);
  TagRepository.getForTrip.mockResolvedValue(tags);
  EntryRepository.getByTripIdWithRelations.mockResolvedValue(entries);

  const json = await exportAllData();
  const data = JSON.parse(json);

  expect(data.trips).toHaveLength(1);
  expect(data.trips[0].title).toBe(longTitle);
  expect(data.trips[0].startDate).toBe("2024-11-28");
  expect(data.trips[0].endDate).toBe("2025-01-02");
  expect(data.trips[0].entries[0].photos).toHaveLength(10);
  expect(data.trips[0].entries[0].photos[0].filename).toBe("photo-0.jpg");
});
