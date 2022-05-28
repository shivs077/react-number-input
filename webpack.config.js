const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/examples/index.js',

  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'index.bundle.js',
  },

  devServer: {
    port: 3000,
    // watchContentBase: true,
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  plugins: [
    new HTMLWebpackPlugin({
      template: './src/examples/index.html',
    }),
  ],
};
