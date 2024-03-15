module.exports = {
  roots: ["<rootDir>"],
  testEnvironment: "node",
  moduleFileExtensions: ["js", "json", "jsx", "ts", "tsx", "node"],

 
  // testRegex: "/tests/instrument\\.test\\.[jt]sx?$",
  // testRegex: "(/__tests__/.*|(\\.|/)(test|spec|instrument))\\.[jt]sx?$",
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec|instrument|exam|event))\\.[jt]sx?$", 
  testPathIgnorePatterns: ["/node_modules/", "course.test.js"],
  collectCoverage: true,
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["lcov", "text-summary"],
};
