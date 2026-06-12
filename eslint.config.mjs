import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import playwrightPlugin from 'eslint-plugin-playwright';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';

const tsProjects = [
	'src/tsconfig.eslint.json',
	'demo/tsconfig.eslint.json',
	'e2e-app/tsconfig.eslint.json',
	'ssr-app/tsconfig.eslint.json',
	'schematics/tsconfig.eslint.json',
];

const tsFiles = ['src/**/*.ts', 'demo/**/*.ts', 'e2e-app/**/*.ts', 'ssr-app/**/*.ts', 'schematics/**/*.ts'];
const htmlFiles = ['src/**/*.html', 'demo/**/*.html', 'e2e-app/**/*.html', 'ssr-app/**/*.html'];

export default tseslint.config(
	{
		ignores: ['**/dist/**', '**/coverage/**', '**/.angular/**', '**/test-reports/**'],
	},
	{
		files: tsFiles,
		extends: [
			eslint.configs.recommended,
			...tseslint.configs.recommended,
			...angular.configs.tsRecommended,
			eslintConfigPrettier,
		],
		processor: angular.processInlineTemplates,
		languageOptions: {
			parserOptions: {
				project: tsProjects,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		plugins: {
			playwright: playwrightPlugin,
			'unused-imports': unusedImportsPlugin,
		},
		rules: {
			semi: 'off',
			'no-empty': ['warn', { allowEmptyCatch: false }],
			'prefer-const': 'off',
			'playwright/no-focused-test': 'error',
			'@angular-eslint/component-class-suffix': 'off',
			'@angular-eslint/directive-class-suffix': 'off',
			'@angular-eslint/no-host-metadata-property': 'off',
			'@angular-eslint/prefer-inject': 'off',
			'@angular-eslint/prefer-on-push-component-change-detection': 'off',
			'@typescript-eslint/adjacent-overload-signatures': 'off',
			'@typescript-eslint/explicit-module-boundary-types': 'off',
			'@typescript-eslint/no-deprecated': 'error',
			'@typescript-eslint/no-empty-object-type': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-non-null-assertion': 'off',
			'@typescript-eslint/no-require-imports': 'off',
			'@typescript-eslint/no-unused-vars': 'off',
			'unused-imports/no-unused-imports': 'error',
		},
	},
	{
		files: ['src/**/*.ts'],
		rules: {
			'@angular-eslint/no-input-rename': 'off',
			'@angular-eslint/no-output-native': 'off',
			'@angular-eslint/no-output-rename': 'off',
			'@typescript-eslint/no-empty-function': 'off',
		},
	},
	{
		files: ['demo/**/*.ts', 'e2e-app/**/*.ts'],
		rules: {
			'@typescript-eslint/no-non-null-assertion': 'off',
		},
	},
	{
		files: htmlFiles,
		extends: [...angular.configs.templateRecommended, eslintConfigPrettier],
	},
);
