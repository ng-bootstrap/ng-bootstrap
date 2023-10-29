import { HttpClient } from '@angular/common/http';
import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgbdDemoVersionsComponent } from './demo-versions.component';
import { NgbdDemoThemeComponent } from './demo-theme.component';

import { COMPONENT_LIST } from './shared/component-list';
import { environment } from '../environments/environment';
import { AnalyticsService } from './services/analytics.service';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
	standalone: true,
	selector: 'ngbd-app',
	templateUrl: './app.component.html',
	imports: [RouterLink, RouterLinkActive, RouterOutlet, NgbdDemoVersionsComponent, NgbdDemoThemeComponent],
})
export class AppComponent implements OnInit {
	downloadCount = '';
	navbarCollapsed = true;

	components = COMPONENT_LIST;

	constructor(private _analytics: AnalyticsService, route: ActivatedRoute, zone: NgZone, httpClient: HttpClient) {
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
