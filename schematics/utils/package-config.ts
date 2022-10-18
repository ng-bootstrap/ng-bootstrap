import { Tree } from '@angular-devkit/schematics';

/**
 * Sorts the keys of the given object.
 * @returns A new object instance with sorted keys
 */
function sortObjectByKeys(obj: Record<string, string>) {
	return Object.keys(obj)
		.sort()
		.reduce((result, key) => (result[key] = obj[key]) && result, {});
}

/**
 * Adds a package to the package.json in the given tree
 */
export function addPackageToPackageJson(tree: Tree, pkg: string, version: string, devDependency = false): Tree {
	if (tree.exists('package.json')) {
		const sourceText = tree.read('package.json')!.toString('utf-8');
		const json = JSON.parse(sourceText);

		const dependenciesType = devDependency ? 'devDependencies' : 'dependencies';
		const dependencies = json[dependenciesType] || {};

		if (!dependencies[pkg]) {
			dependencies[pkg] = version;
			json[dependenciesType] = sortObjectByKeys(dependencies);
		}

		tree.overwrite('package.json', JSON.stringify(json, null, 2));
	}

	return tree;
}

/**
 * Gets the version of the specified package by looking at the package.json in the given tree
 */
export function getPackageVersionFromPackageJson(
	tree: Tree,
	name: string,
	includeDevDependencies = false,
): string | null {
	if (!tree.exists('package.json')) {
		return null;
	}

	const packageJson = JSON.parse(tree.read('package.json')!.toString('utf8'));

	if (packageJson.dependencies && packageJson.dependencies[name]) {
		return packageJson.dependencies[name];
	}

	if (includeDevDependencies && packageJson.devDependencies && packageJson.devDependencies[name]) {
		return packageJson.devDependencies[name];
	}

	return null;
}
