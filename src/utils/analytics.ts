export type AnalyticsPayload = Record<string, string | number | boolean | null | undefined>;

export function trackEvent(_name: string, _payload: AnalyticsPayload = {}): void {
  // No-op analytics adapter. Wire to a real client when available.
}
