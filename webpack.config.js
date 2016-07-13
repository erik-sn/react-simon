/**
 * This config file is specific to development. When we run "node server.js"
 * the server.js file uses the WebpackDevServer with this file as a configuration.
 *
 * This webpack is configured for hot reloading and SASS transpiling.
 */

var path = require('path');
var webpack = require('webpack');
require('es6-promise').polyfill()

module.exports = {
  // see https://webpack.github.io/docs/configuration.html#devtool
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/index',
  ],
  output: {
    // this output is virtual/in memory when using WebpackDevServer
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/dist/',
  },
  plugins: [
    // enable hot module replacement
    new webpack.HotModuleReplacementPlugin(),

    /**
   *  This plugin is necessary because we are using a SASS compiler through
   *  webpack on the client side. Because our JS/ES6 code is also loaded through
   *  node in this server file, we will get syntax errors if the node server
   *  attemps to parse the css/scss files.
   *
   *  To bypass this, we set this process.env variable as true here and delete
   *  it in server.production.js. Then we only import/require the css/scss files
   *  in React components if this variable exists (and is true).
   *
   *  This is unique to Isomorphic applications, see here:
   *      http://stackoverflow.com/a/30355080/4396787
   *
   */
    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: JSON.stringify(true),
      },
    }),
  ],
  module: {
    // react-hot MUST be before babel
    loaders: [{
      test: /\.js$/,
      loaders: ['react-hot', 'babel'],
      include: path.join(__dirname, 'src'),
    },
    {
      /*
       *  test matches all SASS files. Transpiler reads right to left: takes in sass
       *  turns it into css, and then adds it as <style> tags to the html.
       *
       * This setup allows for hot reloading of CSS because the <style> tags are
       * reloaded on each save.
       */
      test: /\.scss$/,
      loaders: ['style', 'css', 'sass'],
    },
    {
      test: /\.jpe?g$|\.gif$|\.png$/i,
      loader: 'file-loader?name=/img/[name].[ext]',
    },
    ],
  },
};
