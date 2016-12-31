const webpack = require('webpack');

module.exports = {
  entry: './src/frontend/app.js',
  output: {
    path: './bin/app',
    filename: 'app.bundle.js',
    publicPath: '/'
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.(jpe?g|png|gif|svg)$/i,
      loaders: [
        'file?hash=sha512&digest=hex&name=[hash].[ext]',
        'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
      ]
    }]
  },
  node: {
    console: true,
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  plugins: [ new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]
};
