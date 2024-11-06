/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type {Config} from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './src'
})

const config: Config = {
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",
  setupFiles: ["<rootDir>/jest.setup.js"],
  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // A preset that is used as a base for Jest's configuration
  preset: "ts-jest",
  // The test environment that will be used for testing
  testEnvironment: "jsdom",
  injectGlobals: true
};

export default createJestConfig(config);
