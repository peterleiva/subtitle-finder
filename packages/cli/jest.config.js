const { resolve } = require('path');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  displayName: {
    name: 'CLI',
    color: 'blue',
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './lib',
  moduleDirectories: [resolve(__dirname, 'lib'), 'node_modules'],

  collectCoverage: true,
  coverageDirectory: resolve(__dirname, './coverage'),
};
