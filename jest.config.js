module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // Map "@/..." to "src/..."
  },
  moduleDirectories: ["node_modules", "src"], // Ensure Jest resolves modules from "src"
};
