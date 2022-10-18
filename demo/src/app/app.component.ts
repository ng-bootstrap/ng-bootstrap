import { ViewportScroller } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';

import { environment } from '../environments/environment';
import { componentsList } from './shared';
import { Analytics } from './shared/analytics/analytics';
import { of } from 'rxjs';

@Component({ selector: 'ngbd-app', templateUrl: './app.component.html' })
export class AppComponent implements OnInit {
	downloadCount = '';
	navbarCollapsed = true;

	components = componentsList;

	constructor(
		private _analytics: Analytics,
		route: ActivatedRoute,
		vps: ViewportScroller,
		zone: NgZone,
		httpClient: HttpClient,
	) {
		route.fragment
			.pipe(filter((fragment) => !!fragment))
			.subscribe((fragment: string) =>
				zone.runOutsideAngular(() => requestAnimationFrame(() => vps.scrollToAnchor(fragment))),
			);

		if (environment.production) {
			httpClient
				.get<{ downloads: string }>('https://api.npmjs.org/downloads/point/last-month/@ng-bootstrap/ng-bootstrap')
				.pipe(map((data) => data?.downloads))
				.subscribe({ next: (count) => (this.downloadCount = count.toLocaleString()), error: () => of('') });
		}
	}

	ngOnInit(): void {
		this._analytics.trackPageViews();
	}
}
