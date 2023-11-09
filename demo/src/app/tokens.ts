import { inject, InjectionToken } from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * Checks if we're at the 'ng-bootstrap.github.io'
 */
export const IS_PRODUCTION = new InjectionToken<boolean>('isProduction', {
	providedIn: 'root',
	factory: () => inject(DOCUMENT).location.href.includes('ng-bootstrap.github.io'),
});

/**
 * Fetches npm views if we're in production
 */
export const NPM_VIEWS = new InjectionToken<Promise<string>>('npmViews', {
	providedIn: 'root',
	factory: () => {
		return inject(IS_PRODUCTION)
			? fetch('https://api.npmjs.org/downloads/point/last-month/@ng-bootstrap/ng-bootstrap')
					.then((response) => response.json())
					.then((data: { downloads: number }) => data?.downloads.toLocaleString())
			: Promise.resolve('');
	},
});
