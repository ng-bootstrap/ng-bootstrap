import { Component } from '@angular/core';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'nav-component',
    imports: [NgbNavModule],
    template: `
		<ul ngbNav #nav="ngbNav" class="nav-tabs">
			<li ngbNavItem>
				<a ngbNavLink>Tab One</a>
				<ng-template ngbNavContent>Content one</ng-template>
			</li>
			<li ngbNavItem>
				<a ngbNavLink><b>Tab</b> Two</a>
				<ng-template ngbNavContent>Content two</ng-template>
			</li>
			<li ngbNavItem [disabled]="true">
				<a ngbNavLink>Tab Three</a>
				<ng-template ngbNavContent>Content three</ng-template>
			</li>
		</ul>
		<div [ngbNavOutlet]="nav"></div>
	`
})
export class NavComponent {}
