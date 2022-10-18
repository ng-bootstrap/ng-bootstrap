const pkg = require('../package.json');
const typescript = require('@rollup/plugin-typescript');
const replace = require('@rollup/plugin-replace');
const path = require('path');
const { promises: fs } = require('fs');

const version = (str) => JSON.stringify(str.startsWith('^') ? str : '^' + str);

const distDir = path.join(__dirname, 'dist');

const clean = () => ({
	async buildStart() {
		await fs.rm(distDir, { force: true, recursive: true });
	},
});

module.exports = [
	{
		output: {
			dir: distDir,
			format: 'cjs',
			exports: 'named',
		},
		input: {
			'ng-add/index': path.join(__dirname, 'ng-add/index.ts'),
			'ng-add/setup-project': path.join(__dirname, 'ng-add/setup-project.ts'),
		},
		external: (dependency) =>
			!(dependency.startsWith('./') || dependency.startsWith('../') || dependency.startsWith(__dirname)),
		plugins: [
			clean(),
			replace({
				preventAssignment: true,
				'VERSIONS.BOOTSTRAP': version(pkg.devDependencies.bootstrap),
				'VERSIONS.POPPER': version(pkg.devDependencies['@popperjs/core']),
			}),
			typescript({
				tsconfig: path.join(__dirname, 'tsconfig.rollup.json'),
			}),
		],
	},
];
