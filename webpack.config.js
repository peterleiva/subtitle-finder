const path = require('path');
const { organizer } = require('webpack-config-organizer');
const nodeExternals = require('webpack-node-externals');

/**
 * @param {object} [env]
 * @param {boolean} [env.clean = false]
 * @return {import("webpack").Configuration}
 */
module.exports = organizer(({ clean = false }) => {
  return {
    target: 'node',
    externalsPresets: { node: true },
    externals: [nodeExternals()],

    context: path.resolve(__dirname, 'lib'),

    entry: './index.js',
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      clean,
    },

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
