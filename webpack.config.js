const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'cytoscape.js-transaction-layout',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
};
