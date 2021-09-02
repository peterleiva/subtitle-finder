/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  projects: ['<rootDir>/packages/*/jest.config.js'],
  watchPlugins: ['jest-watch-select-projects'],
};
