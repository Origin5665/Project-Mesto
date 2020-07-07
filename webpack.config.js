const path = require('path'),
   WebpackMd5Hash = require('webpack-md5-hash'),
   MiniCssExtractPlugin = require("mini-css-extract-plugin"),
   HtmlWebpackPlugin = require('html-webpack-plugin'),
   webpack = require('webpack'),
   OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
   isDev = process.env.NODE_ENV === 'development'


module.exports = {


   entry: {
      main: './src/index.js'
   },
   output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[chunkhash].js'
   },
   module: {
      rules: [{
         test: /\.js$/,
         use: { loader: "babel-loader" },
         exclude: /node_modules/
      },
      {
         test: /\.css$/i,
         use: [(isDev ? 'style-loader' : MiniCssExtractPlugin.loader), 'css-loader', 'postcss-loader']
      },
      {
         test: /\.(png|jpe?g|gif|ico|svg)$/i,
         use: [
            'file-loader?name=images/[name].[ext]',
            {
               loader: 'image-webpack-loader',
               options: {

               }
            },
         ],
      },
      {
         test: /\.(eot|ttf|woff|woff2)$/,
         loader: 'file-loader?name=./vendor/[name].[ext]'
      }
      ]
   },
   plugins: [
      new MiniCssExtractPlugin({ filename: 'style.[contenthash].css', }),
      new OptimizeCssAssetsPlugin({
         assetNameRegExp: /\.css$/g,
         cssProcessor: require('cssnano'),
         cssProcessorPluginOptions: {
            preset: ['default'],
         },
         canPrint: true
      }),

      new HtmlWebpackPlugin({
         inject: false,
         template: './src/index.html',
         filename: 'index.html'
      }),
      new webpack.DefinePlugin({
         'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }),
      new WebpackMd5Hash(),



   ]
}