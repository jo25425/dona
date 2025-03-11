/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';
import nextJest from 'next/jest';
import "dotenv/config";

const createJestConfig = nextJest({
  dir: './src'
})

const config: Config = {
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",
  setupFiles: ["dotenv/config", "<rootDir>/jest.setup.js"],
  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@models/(.*)$': '<rootDir>/src/models/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1'
  },
  // A preset that is used as a base for Jest's configuration
  preset: "ts-jest",
  // The test environment that will be used for testing
  testEnvironment: "node",
  injectGlobals: true,
  // Restrict Jest to only proper test files, not helpers
  testMatch: ["**/__tests__/**/*.test.ts?(x)", "**/__tests__/**/*.spec.ts?(x)"]

};

export default createJestConfig(config);
