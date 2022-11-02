import type { Config } from 'jest';
const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  maxConcurrency: 10,
  collectCoverage: true,
  reporters: ['default', ['jest-junit', { outputDirectory: 'coverage', outputName: 'junit.xml' }]],
  coverageReporters: ['json-summary', 'text'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coveragePathIgnorePatterns: ['src/types'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 70,
      lines: 80,
      statements: 80,
    },
    'src/index.ts': {
      branches: 100,
      functions: 0,
      lines: 100,
      statements: 100,
    },
  },
};

export default config;
