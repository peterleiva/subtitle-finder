const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const configFile = path.resolve(__dirname, '../../tsconfig.json');

/**
 * TODO: lint on demand using env variable
 *
 * @param {object} [env]
 * @param {undefined | true} [env.lint]
 * @returns {import("webpack").Configuration}
 */
module.exports = function typescriptPreset() {
  return {
    resolve: {
      extensions: ['.ts'],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: [
            /node_modules/,
            /__(tests?|mocks|snapshots)__/,
            /\.(test|specs?)\.ts$/,
            /tests?/,
            /spec/,
          ],
          use: {
            loader: 'ts-loader',
            options: {
              projectReferences: true,
              configFile,
              transpileOnly: true,
            },
          },
        },
      ],
    },

    plugins: [
      // new ForkTsCheckerWebpackPlugin({
      //   typescript: { configFile },
      //   eslint: {
      //     files: '**/*.{ts,js}',
      //     options: {
      //       ignorePattern: ['**/__tests__/**/*', '__mocks__', '__snapshots__'],
      //     },
      //   },
      // }),
    ],
  };
};
