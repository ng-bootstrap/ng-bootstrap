export function noProject(project: string) {
	return `Unable to find project '${project}' in the workspace`;
}

export function unsupportedStyles(styleFilePath: string) {
	return `Project style file found has unsupported extension: '${styleFilePath}'\nAdding 'bootstrap.min.css' to 'angular.json'`;
}

export function noMainFile(projectName: string) {
	return `Unable to find 'build.options.main' file path for project "${projectName}"`;
}

export function noModuleFile(moduleFilePath: string) {
	return `File '${moduleFilePath}' does not exist.`;
}
