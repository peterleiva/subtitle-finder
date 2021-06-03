const NodemonPlugin = require('nodemon-webpack-plugin');
const { ProgressPlugin } = require('webpack');

module.exports = {
  devtool: 'cheap-source-map',
  mode: 'development',
  plugins: [new NodemonPlugin(), new ProgressPlugin()],

  output: {
    clean: true,
  },
};
