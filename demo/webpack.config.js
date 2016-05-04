const separator = __dirname.match(/\//) ? '/' : '\\';
const appRoot   = __dirname + separator;

module.exports = {
	context: __dirname,
	entry: {
		app: './src/app.js',
	},
	output: {
		path: appRoot + 'dist',
		filename: '[name].js'
	},
	resolve: {
		extension: ['', '.js']
	},
	stats: {
		colors: true,
		reasons: true,
		chunks: false
	},
	plugins: [],
	module: {
		preLoaders: [
			{test: /\.jsx$/, loader: 'external-jsx', include: appRoot + 'src'}
		],
		loaders: [
			{test: /\.jsx?$/, loader: 'babel', include: appRoot + 'src'}
		]
	}
}
