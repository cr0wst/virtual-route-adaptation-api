/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}],
  },
  moduleNameMapper: {
    "^@tests/(.*)$": "<rootDir>/tests/$1",
    "^@src/(.*)$": "<rootDir>/src/$1",
  },
};
