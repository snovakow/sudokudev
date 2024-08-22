const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
	mode: "production",
	entry: './main.js',
	output: {
		filename: '[chunkhash].js',
		path: path.resolve(__dirname, '../../live/sudokudev'),
		chunkFilename: '[chunkhash].js',
		clean: true,
		publicPath: ''
	},
	plugins: [
		new CopyPlugin({
			patterns: [
				{ from: 'about.html', to: 'about.html' },
				{ from: 'generate.html', to: 'generate.html' },
				{ from: 'worker.js', to: 'worker.js' },
				{ from: 'stats.html', to: 'stats.html' },
			]
		}),
		new HtmlWebpackPlugin({
			title: ""
		})
	],
};
