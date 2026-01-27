import { SearchRepository } from "../../src/db/repositories/SearchRepository";

const mockTrackingDb = {
  getAllAsync: jest.fn(async (sql: string) => {
    if (sql.includes("FROM trips")) {
      return [
        {
          id: "trip-1",
          title: "City Break (Special #1)",
          location: "Paris",
          summary: "Cotes d'Azur & more",
        },
      ];
    }

    return [];
  }),
};

jest.mock("../../src/db/database", () => ({
  getDatabase: jest.fn(async () => mockTrackingDb),
}));

test("search handles special characters without crashing", async () => {
  const results = await SearchRepository.search("Special #1");

  expect(results).toHaveLength(1);
  expect(results[0].matchedField).toBe("title");
  expect(results[0].matchedText).toBe("City Break (Special #1)");
});
