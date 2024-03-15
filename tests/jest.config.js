module.exports = {
  roots: ["<rootDir>"],
  testEnvironment: "node",
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],

  // testRegex: "(/__tests__/.*|(\\.|/)(test|spec|instrument))\\.[jt]sx?$",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec|instrument|exam|event))\\.[jt]sx?$",  collectCoverage: true,
  collectCoverage: true,
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["lcov", "text-summary"],
};
