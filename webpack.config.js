const path = require('path');

module.exports = {
  entry: './example/index',
  mode: 'development',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 3001,
  },
  output: {
    publicPath: 'auto',
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx'],
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
    },  {
      test: /\.(png|jpe?g|gif)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8192
          }
        }
      ]
    }, {
      test: /\.md$/,
      loader: require.resolve(path.resolve(__dirname, './index.js')),
      exclude: /node_modules/,
    }],
  }
};
