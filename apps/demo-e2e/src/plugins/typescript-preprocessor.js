/* eslint-disable require-yield */
('use strict');
Object.defineProperty(exports, '__esModule', { value: true });
const tslib = require('tslib');
const wp = require('@cypress/webpack-preprocessor');
const tsconfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
let plugins;

function preprocessTypescript(config, customizeWebpackConfig) {
  if (!config.env.tsConfig) {
    throw new Error('Please provide an absolute path to a tsconfig.json as cypressConfig.env.tsConfig');
  }

  if (config.env.ci) {
    console.log('\n[ACM] [INFO] Cypress tests running in CI mode');
  }

  return file => {
    file.on('close', () => {
      plugins = undefined;
    });

    return tslib.__awaiter(this, void 0, void 0, function* () {
      const webpackOptions = customizeWebpackConfig
        ? customizeWebpackConfig(getWebpackConfig(config))
        : getWebpackConfig(config);
      return wp({ webpackOptions })(file);
    });
  };
}

exports.preprocessTypescript = preprocessTypescript;

function getWebpackConfig(config) {
  const extensions = ['.ts', '.js'];
  plugins = config.env.ci
    ? []
    : [
        new ForkTsCheckerWebpackPlugin({
          tsconfig: config.env.tsConfig,
          useTypescriptIncrementalApi: false
        })
      ];

  return {
    resolve: {
      extensions,
      plugins: [
        new tsconfigPathsWebpackPlugin.TsconfigPathsPlugin({
          configFile: config.env.tsConfig,
          extensions
        })
      ]
    },
    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
          loader: require.resolve('ts-loader'),
          exclude: [/node_modules/],
          options: {
            configFile: config.env.tsConfig,
            // https://github.com/TypeStrong/ts-loader/pull/685
            experimentalWatchApi: true,
            transpileOnly: true
          }
        }
      ]
    },
    plugins,
    externals: [nodeExternals()]
  };
}
