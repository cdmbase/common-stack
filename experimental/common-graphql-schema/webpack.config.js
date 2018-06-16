var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var nodeExternals = require('webpack-node-externals');


var webpack_opts = {   
  mode: 'development',
  entry: {
    index: './src/index.ts',
    'validation.test': './src/__tests__/validation.ts'
  },
  target: 'node',
  output: {
<<<<<<< HEAD:experimental/common-graphql-schema/webpack.config.js
    filename: libPath('[name].js'),
    library: '@common-stack/graphql-schema',
=======
    path: path.join(__dirname, 'lib'),
    filename: '[name].js',
    library: '@common-stack/graphql-schema',
>>>>>>> f4ab7cd01d19552faea5da1c006ed4e0322af3bd:packages/sample-graphql-schema/webpack.config.js
    libraryTarget: 'commonjs2',
  },
  resolve: {
    extensions: ['.ts', '.js', '.graphql'],
    modules: [
      'node_modules',
      'src',
    ]
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        test: /\.ts$/,
        ts: {
          compiler: 'typescript',
          configFile: 'tsconfig.json'
        },
        tslint: {
          emitErrors: true,
          failOnHint: true
        }
      }
    })
  ],
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.ts$/,
      exclude: /node_modules/,
      loaders: 'ts-loader'
    },
    {
      test: /\.graphql?/,
      exclude: /node_modules/,
      use: 'raw-loader'
    },]
  },
  externals: [
    nodeExternals({ modulesDir: "../../node_modules" }),
    nodeExternals()
  ]
};

module.exports = webpack_opts;