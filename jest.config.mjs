// import config from './jest.config-common.mjs';

// eslint-disable-next-line no-console
console.log('⚡ Using Jest config from `jest.config.mjs`');

/** @type {import('jest').Config} */
export default {
  cache: true,
  verbose: true,
  cacheDirectory: '<rootDir>/tmp/jest',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  // which files to test and which to ignore
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
  testPathIgnorePatterns: ['/node_modules/', '/tmp/', '/coverage/', '/dist/'],

  // https://kulshekhar.github.io/ts-jest/docs/guides/esm-support
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: { '^(\\.{1,2}/.*)\\.js$': '$1' },
  transform: {
    '\\.(ts|tsx|js)$': ['ts-jest', { useESM: true }],
  },
};
