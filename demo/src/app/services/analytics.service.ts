import { inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { IS_PRODUCTION } from '../tokens';

declare const gtag: any;

/**
 * Simple Google Analytics service. Note that all its methods don't do anything unless the app
 * is deployed on ng-bootstrap.github.io. This avoids sending events and page views during development.
 */
@Injectable({
	providedIn: 'root',
})
export class AnalyticsService {
	private isProduction = inject(IS_PRODUCTION);
	private router = inject(Router);

	/**
	 * Intended to be called only once. Subscribes to router events and sends a page view
	 * after each ended navigation event.
	 */
	start() {
		if (this.isProduction) {
			this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
				const data = {
					page_path: this.router.url,
				};

				if (this.router.url.startsWith('/components')) {
					data['component_name'] = this.router.url.split('/')[2];
				}
				gtag('event', 'ngb_navigation', data);
			});
		}
	}

	/**
	 * Sends an event.
	 */
	trackClick(action: string, options: Record<string, string> = {}) {
		const data = {
			event_action: action,
			...options,
		};

		if (this.isProduction) {
			gtag('event', 'ngb_click', data);
		}
	}
}
