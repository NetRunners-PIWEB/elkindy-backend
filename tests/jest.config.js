module.exports = {
  roots: ["<rootDir>"],
  testEnvironment: "node",
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],

  testRegex: "(/__tests__/.*|(\\.|/)(test|spec|instrument|exam))\\.[jt]sx?$",
  // testRegex: "/tests/instrument\\.test\\.[jt]sx?$",
  collectCoverage: true,
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["lcov", "text-summary"],
};
