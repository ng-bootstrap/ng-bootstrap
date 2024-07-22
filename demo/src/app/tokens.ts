import { inject, InjectionToken } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { versions } from './versions';

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

/**
 * Library versions
 */
export const LIB_VERSIONS = new InjectionToken('versions', {
	providedIn: 'root',
	factory: () => versions,
});

/**
 * Table of contents
 */
export const OVERVIEW_FRAGMENTS = new InjectionToken<Record<string, string>>('overview');

/**
 * Demos
 */
export interface Demo {
	fragment: string;
	title: string;
	code?: string;
	markup?: string;
	type: any;
	files?: { name: string; source: string }[];
	showStackblitz?: boolean;
}

export interface ComponentData {
	name: string;
	bootstrapUrl?: string;
	header?: any;
	overview: Record<string, string>;
	demos: Demo[];
}

export interface MenuItem {
	title: string;
	fragment: string;
}

let counter = 1;
export function MENU_SEPARATOR(): MenuItem {
	return { fragment: `separator-${counter++}`, title: 'separator' };
}

export const COMPONENT_DATA = new InjectionToken<ComponentData>('metadata');
