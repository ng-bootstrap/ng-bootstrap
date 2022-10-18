import { FullConfig } from '@playwright/test';
import { promises as fs } from 'fs';
import { join } from 'path';
import NYC from 'nyc';

async function globalSetup(config: FullConfig) {
	const nycOutput = join(__dirname, '..', '.nyc_output');
	await fs.rm(nycOutput, { recursive: true, force: true });
	await fs.mkdir(nycOutput);
	return async () => {
		const nycInstance = new NYC({
			cwd: join(__dirname, '..'),
			reportDir: `coverage-e2e`,
			reporter: ['lcov', 'json', 'text-summary'],
		});
		nycInstance.report();
		nycInstance.cleanup();
	};
}

export default globalSetup;
