/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  silent: true,
  noStackTrace: true,
  verbose: true,
  setupFiles: [
    './src/infra/database/mongodb.ts'
  ]
};
