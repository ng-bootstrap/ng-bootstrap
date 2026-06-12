import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap/config';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from './navigation.component';

@Component({
	selector: 'app-root',
	imports: [NavigationComponent, RouterOutlet],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="container-fluid">
			<h1>ng-bootstrap e2e test application</h1>
			<hr />
			<app-navigation></app-navigation>
			<hr />
			<router-outlet></router-outlet>
		</div>
	`,
})
export class AppComponent {
	constructor(ngbConfig: NgbConfig) {
		ngbConfig.animation = false;
	}
}
