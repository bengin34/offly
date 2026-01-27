import {
  isMapUrl,
  isShortMapUrl,
  parseMapUrl,
  isValidCoordinates,
} from "../../src/utils/mapUrlParser";

test("parses Google Maps ?q=lat,lng format", () => {
  const result = parseMapUrl("https://maps.google.com/?q=37.7749,-122.4194");
  expect(result?.latitude).toBeCloseTo(37.7749);
  expect(result?.longitude).toBeCloseTo(-122.4194);
});

test("parses Google Maps place format with name", () => {
  const result = parseMapUrl(
    "https://www.google.com/maps/place/Golden+Gate+Bridge/@37.8199,-122.4783,12z",
  );
  expect(result?.name).toBe("Golden Gate Bridge");
  expect(result?.latitude).toBeCloseTo(37.8199);
  expect(result?.longitude).toBeCloseTo(-122.4783);
});

test("parses Apple Maps ll + q format", () => {
  const result = parseMapUrl(
    "https://maps.apple.com/?ll=48.8584,2.2945&q=Eiffel+Tower",
  );
  expect(result?.name).toBe("Eiffel Tower");
  expect(result?.latitude).toBeCloseTo(48.8584);
  expect(result?.longitude).toBeCloseTo(2.2945);
});

test("parses Apple Maps address-only format", () => {
  const result = parseMapUrl(
    "https://maps.apple.com/?address=1+Infinite+Loop,+Cupertino",
  );
  expect(result?.name).toBe("1 Infinite Loop, Cupertino");
  expect(result?.latitude).toBeUndefined();
  expect(result?.longitude).toBeUndefined();
});

test("detects map URLs and short map URLs", () => {
  expect(isMapUrl("https://maps.app.goo.gl/abc123")).toBe(true);
  expect(isShortMapUrl("https://maps.app.goo.gl/abc123")).toBe(true);
  expect(isMapUrl("https://example.com")).toBe(false);
});

test("validates coordinate ranges", () => {
  expect(isValidCoordinates(90, 180)).toBe(true);
  expect(isValidCoordinates(-91, 0)).toBe(false);
  expect(isValidCoordinates(0, 181)).toBe(false);
});
