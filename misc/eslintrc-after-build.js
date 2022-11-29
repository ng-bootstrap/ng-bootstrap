/*
 * This was added initially to check ng-packagr generated files for linting errors.
 *
 * ```
 * @Component()
 * class A {
 *   // this would fail at runtime after build without forwardRef()
 *   // with 'cannot access B before initialization' error
 * 	 constructor(@Inject(forwardRef(() => B)) b: B) {}
 * }
 *
 * @Component({
 * 	 standalone: true,
 * 	 imports: [A]
 * })
 * class B {}
 *
 */
module.exports = {
	root: true,
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
	},
	plugins: ['deprecation'],
	rules: {
		'no-use-before-define': ['error', { classes: false, functions: false, variables: false }],
	},
};
