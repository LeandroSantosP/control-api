import 'dotenv/config';
import { execSync } from 'child_process';
process.env.DATABASE_URL = `${process.env.DATABASE_URL}_testdb02?schema=test_schema`;

execSync('yarn prisma migrate deploy');

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
