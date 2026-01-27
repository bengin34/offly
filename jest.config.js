module.exports = {
  preset: "jest-expo",
  testMatch: ["<rootDir>/tests/**/*.test.ts"],
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native|expo(nent)?|@expo(nent)?/.*|expo-router|@react-navigation/.*|react-navigation|@expo-google-fonts/.*))",
  ],
};
