/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  displayName: {
    name: 'providers',
    color: 'magenta',
  },
  testEnvironment: 'node',
  rootDir: 'lib',
  preset: 'ts-jest',

  collectCoverage: true,
};
