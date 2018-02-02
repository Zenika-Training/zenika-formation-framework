const path = require('path')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const extractCss = new ExtractTextPlugin({
  filename: 'slides.[contenthash].css',
})

module.exports = {
  entry: {
    // app: path.join(__dirname, 'src', 'slides.js'),
    // vendor: ['./reveal/remark/index.js', './src/jit/jit-yc.js']
  },
  output: {
    filename: 'slides-[name].js',
    // path: path.join(__dirname, 'dist-webpack'),
    publicPath: '/'
  },
  devServer: {
    port: 8080
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'zenika-formation-framework/node_modules/style-loader',
          'zenika-formation-framework/node_modules/css-loader'
        ]
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: 'zenika-formation-framework/node_modules/file-loader?name=[name].[ext]?outputPath=fonts/'
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: 'zenika-formation-framework/node_modules/file-loader?outputPath=img/'
      },
      {
        test: /\.(md|markdown)$/,
        use: 'zenika-formation-framework/node_modules/markdown-image-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'index-webpack.html')
    }),
    extractCss,
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime'
    })
  ]
}
