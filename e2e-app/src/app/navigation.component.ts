import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { ROUTES } from './app.routes';

@Component({
	selector: 'app-navigation',
	standalone: true,
	template: `
		<a role="button" class="btn btn-outline-primary ms-3" id="navigate-home" href="#/">Menu</a>
		<div [hidden]="isHidden">
			@for (route of routes; track route) {
				<div class="card m-1 d-inline-block" style="width: 290px;">
					<div class="card-header">{{ route.path }}</div>
					<ul class="list-group list-group-flush">
						@for (childRoute of route.children; track childRoute) {
							<li class="list-group-item">
								<a
									href="#{{ route.path }}/{{ childRoute.path }}"
									id="navigate-{{ route.path }}-{{ childRoute.path }}"
									class="list-group-link"
									>{{ childRoute.path }}</a
								>
							</li>
						}
					</ul>
				</div>
			}
		</div>
	`,
})
export class NavigationComponent {
	routes;
	isHidden = false;

	constructor(public router: Router) {
		this.routes = ROUTES;

		router.events.subscribe((evt) => {
			if (evt instanceof NavigationEnd) {
				this.isHidden = evt.url !== '/';
			}
		});
	}
}
