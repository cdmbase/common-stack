var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var webpack_opts = {
  mode: 'development',
  entry: './src/index.ts',
  target: 'node',
  output: {
    path: path.join(__dirname, 'lib'),
    filename: 'index.js',
    libraryTarget: "commonjs2",
    library: "@common-stack/client-react"
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.css']
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        test: /\.tsx?$/,
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
      test: /\.tsx?$/,
      loaders: 'ts-loader'
    },
    {
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader'
    },
    {
      test: /\.svg$/,
      use: {
        loader: 'svg-url-loader',
        options: {
          noquotes: true,
        }
      }
    },    {
      test: /\.css$/,
      use: [
        { loader: 'css-loader', options: { importLoaders: 1 } },
      ]
    },
    ]
  },
  externals: [
    nodeExternals({
      modulesDir: "../../node_modules"
    }),
    nodeExternals()
  ]
};

module.exports = webpack_opts;
