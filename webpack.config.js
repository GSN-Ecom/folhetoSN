const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.js', // ou onde seu código principal está
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // ou a pasta que você quer usar
  },
  plugins: [
    new Dotenv(),
  ],
};
