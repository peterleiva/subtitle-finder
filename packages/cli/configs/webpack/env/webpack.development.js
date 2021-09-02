const { ProgressPlugin } = require('webpack');

module.exports = {
  devtool: 'cheap-source-map',
  mode: 'development',
  plugins: [new ProgressPlugin()],

  output: {
    clean: true,
  },
};
