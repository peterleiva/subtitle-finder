# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

-   `CLI`

    -   Helpers
    -   Top-level CLI with several commands
    -   **command search**: query subtitles, for all providers, **by keyword** showing the results back to `stdout`

-   `Providers`
    -   Provider's factory to create a collection of providers
    -   Cache results returned by providers
    -   Web crawler to collect [legendei.to](https://legendei.to) and [legendas.tv](http://legendas.tv)
    -   Use API to collect [OpenSubtitles](http://opensubtitles.com/)

## [0.1.0] - 2021-06-03

## Added

-   npm init the project
-   Install prettier
-   Use conventional commit to lint commit messages
-   Install webpack
-   Install eslint
-   Install typescript
-   Install Jest
-   Setup github actions
-   npm scripts:
    -   `npm start` - start the application
    -   `npm run build` - build in prod mode using webpack
    -   `npm run build:dev` - build in dev mode using webpack
    -   `npm run build:analyzer` - analyze the bundler using webpack-bundle-analyzer
    -   `npm run dev` - build the application in dev mode with webpack
    -   `npm run format` - format the codebase using prettier
    -   `npm run format:check` - check what files are formatted using prettier
    -   `npm run test` - test the project using jest
    -   `npm run test:watch` - start test in watch mode

[unreleased]: https://github.com/pherval/subtitle-finder/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/pherval/subtitle-finder/tag/v0.1.0
