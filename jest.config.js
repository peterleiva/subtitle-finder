const path = require('path');

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },

  rootDir: './lib',
  moduleDirectories: [path.resolve(__dirname, 'lib'), 'node_modules'],

  collectCoverage: true,
  coverageDirectory: path.resolve(__dirname, './coverage'),
};
