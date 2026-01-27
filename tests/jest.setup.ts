const mockFiles = new Map<string, string>();

class MockFile {
  uri: string;

  constructor(uri: string) {
    this.uri = uri;
  }

  async text(): Promise<string> {
    if (!mockFiles.has(this.uri)) {
      throw new Error(`Mock file not found: ${this.uri}`);
    }
    return mockFiles.get(this.uri)!;
  }

  async write(data: string): Promise<void> {
    mockFiles.set(this.uri, data);
  }
}

(global as { __mockFiles?: Map<string, string> }).__mockFiles = mockFiles;

jest.mock("expo-file-system/next", () => ({
  File: MockFile,
}));

jest.mock("expo-file-system", () => ({
  File: MockFile,
  Paths: { cache: "/tmp" },
}));

jest.mock("expo-sharing", () => ({
  isAvailableAsync: jest.fn(async () => true),
  shareAsync: jest.fn(async () => undefined),
}));

jest.mock("expo-document-picker", () => ({
  getDocumentAsync: jest.fn(async () => ({ canceled: true, assets: [] })),
}));
