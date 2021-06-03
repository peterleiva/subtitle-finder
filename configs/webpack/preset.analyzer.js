const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

/**
 * @returns {import("webpack").Configuration}
 */
module.exports = {
  plugins: [new BundleAnalyzerPlugin()],
};
