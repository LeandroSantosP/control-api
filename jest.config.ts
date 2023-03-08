module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['<rootDir/src/modules/**/usecases/**/*.ts>'],
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
  },
  collectCoverage: true,

  coverageProvider: 'v8',
  coverageReporters: ['lcov', 'text-summary'],
};
