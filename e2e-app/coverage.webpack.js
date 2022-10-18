module.exports = {
	module: {
		rules: [
			{
				test: /bootstrap\.css$/,
				use: [
					{
						// This loader is used to remove from bootstrap during the e2e-app build
						// the :lang(en) selector that causes a warning.
						loader: require.resolve('./removeLangSelector'),
					},
				],
			},
			{
				test: /\.(js|ts)$/,
				use: [
					{
						loader: 'coverage-istanbul-loader',
						options: { esModules: true },
					},
				],
				enforce: 'post',
				include: require('path').join(__dirname, '..', 'src'),
				exclude: [/\.(e2e|spec|po)\.ts$/, /node_modules/, /(ngfactory|ngstyle)\.js/],
			},
		],
	},
};
