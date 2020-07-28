const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const { ProvidePlugin } = require('webpack');

const ROOT = path.resolve(__dirname, '');
const DESTINATION = path.resolve(__dirname, 'dist');

webpackConfig = module.exports = {
  context: ROOT,
  entry: {
    main: `./src/index.ts`,
  },
  output: {
    filename: '[name].bundle.js',
    path: DESTINATION,
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [ROOT, 'node_modules'],
    alias: {
      assets: path.join(__dirname, 'assets/'),
    },
  },
  module: {
    exprContextCritical: false,
    rules: [
      { test: /\.ts$/, enforce: 'pre', loader: 'tslint-loader' },
      {
        test: /\.(gif|png|jpg|jpeg|svg|mp3|json|ogg|fnt|ttf|atlas|xml)$/,
        loader: 'file-loader?name=assets/[name].[ext]',
      },
      { test: /pixi\.js$/, loader: 'expose-loader?PIXI' },
      { test: /phaser-split\.js$/, loader: 'expose-loader?Phaser' },
      { test: /p2\.js$/, loader: 'expose-loader?p2' },
      { test: /\.ts$/, loader: 'ts-loader', exclude: '/node_modules/' },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devtool: 'cheap-module-source-map',
  devServer: {},
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new ProvidePlugin({
      PIXI: 'pixi.js',
    }),
    new CopyPlugin([
      { from: './index.html', to: DESTINATION },
      { from: './src/assets', to: 'assets' },
    ]),
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 8080,
      server: { baseDir: ['./dist'] },
    }),
  ],
};
