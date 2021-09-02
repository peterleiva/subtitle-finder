const path = require('path');
const { organizer } = require('webpack-config-organizer');
const nodeExternals = require('webpack-node-externals');
const { BannerPlugin } = require('webpack');

/**
 * @param {object} [env]
 * @param {boolean} [env.clean = false]
 * @return {import("webpack").Configuration}
 */
module.exports = organizer(['typescript'], ({ clean = false }) => {
  return {
    target: 'node',
    externalsPresets: { node: true },
    externals: [nodeExternals()],

    context: path.resolve(__dirname, 'lib'),

    entry: {
      cli: 'cli.ts',
      search: {
        import: 'commands/search/index.ts',
        filename: 'commands/[name].js',
      },
    },

    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      clean,
    },

    plugins: [
      new BannerPlugin({
        banner: '#!/usr/bin/env node',
        raw: true,
        entryOnly: true,
      }),
    ],

    resolve: {
      modules: [path.resolve(__dirname, 'lib'), 'node_modules'],
      extensions: ['.js', '.ts', '.json'],
    },

    optimization: {
      moduleIds: 'deterministic',
      runtimeChunk: 'single',
    },
  };
});
