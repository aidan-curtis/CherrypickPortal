var path = require("path")
var nodeExternals = require('webpack-node-externals');

const HtmlWebPackPlugin = require("html-webpack-plugin");

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./public/index.html",
  filename: "./index.html"
});


module.exports = {
	entry: './src/index.js',
	devServer: {
		hot: true,
		contentBase: './',
		historyApiFallback: true
	},
	output: {
		path: __dirname + '/dist',
		publicPath: '/',
		filename: 'bundle.js'
	},
	
	module: {
		rules: [
			{
				test: /\.css$/,

				use: [
					{
						loader: 'style-loader'
					},
					{
						loader: 'css-loader'
					}
				]
			},
			 {
				test: /\.js?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					presets: [
						'@babel/react', 
						'@babel/env',
						{
							plugins: [
								'@babel/plugin-proposal-class-properties'
							]
						}
					]
				}
			},
			{ test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }

		],
	
	},
	plugins: [htmlPlugin],
	resolve: {
		modules: ["node_modules", "src"]    
	}
};