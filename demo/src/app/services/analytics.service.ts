import { inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { IS_PRODUCTION } from '../tokens';

declare const ga: any;

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
				ga('send', { hitType: 'pageview', page: this.router.url });
			});
		}
	}

	/**
	 * Sends an event.
	 */
	trackEvent(action: string, category: string) {
		if (this.isProduction) {
			ga('send', { hitType: 'event', eventCategory: category, eventAction: action });
		}
	}
}
