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
    // filename: 'slides-[name].js',
    // path: path.join(__dirname, 'dist-webpack'),
    // publicPath: '/'
  },
  devServer: {
    port: 8080
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: 'file-loader?name=[name].[ext]?outputPath=fonts/'
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: 'file-loader?outputPath=img/'
      },
      {
        test: /\.(md|markdown)$/,
        use: 'markdown-image-loader'
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
