import { Component } from '@angular/core';

import { Snippet } from '../../../services/snippet';
import { NgbdDemoListService } from '../../../services/demo-list.service';

import { versions } from '../../../../environments/versions';
import { NgbAlertModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdCodeComponent } from '../../../shared/code/code.component';
import { RouterLink } from '@angular/router';
import { NgbdApiDocsBadge } from '../../../shared/api-docs';
import { NgbdOverviewSectionComponent } from '../../../shared/overview/overview-section.component';
import { NgbdOverview } from '../../../shared/overview/overview';

@Component({
	selector: 'ngbd-nav-overview',
	standalone: true,
	imports: [
		NgbNavModule,
		NgbAlertModule,
		NgbdOverviewSectionComponent,
		NgbdCodeComponent,
		RouterLink,
		NgbdApiDocsBadge,
	],
	templateUrl: './nav-overview.component.html',
	host: { '[class.overview]': 'true' },
})
export class NgbdNavOverviewComponent {
	bsVersion = versions.bootstrap;

	BASIC = Snippet({
		lang: 'html',
		code: `
        <ul ngbNav #nav="ngbNav" class="nav-tabs">
          <li ngbNavItem>
            <a ngbNavLink>First</a>
            <ng-template ngbNavContent>First content</ng-template>
          </li>
          <li ngbNavItem>
            <a ngbNavLink>Second</a>
            <ng-template ngbNavContent>Second content</ng-template>
          </li>
        </ul>
        <div [ngbNavOutlet]="nav"></div>
    `,
	});

	SELECTION = Snippet({
		lang: 'html',
		code: `
        <ul ngbNav [(activeId)]="activeId" class="nav-tabs">
          <li [ngbNavItem]="1">
            <a ngbNavLink>First</a>
          </li>
          <li [ngbNavItem]="2">
            <a ngbNavLink>Second</a>
          </li>
        </ul>
    `,
	});

	ROLES = Snippet({
		lang: 'html',
		code: `
        <ul ngbNav [roles]="false" role="myRole" class="nav-pills">...</ul>
    `,
	});

	ROUTER = Snippet({
		lang: 'html',
		code: `
      <!-- your navs bound to current route fragments -->
      <ul ngbNav [activeId]="route.fragment | async" class="nav-tabs">
        <li [ngbNavItem]="link.fragment" *ngFor="let link of links">
          <a ngbNavLink routerLink="." [fragment]="link.fragment">{{ link.title }}</a>
        </li>
      </ul>

      <!-- and an actual outlet elsewhere -->
      <router-outlet></router-outlet>
    `,
	});

	ROUTER_TS = Snippet({
		lang: 'typescript',
		code: `
      links = [
        { title: 'One', fragment: 'one' },
        { title: 'Two', fragment: 'two' }
      ];

      constructor(public route: ActivatedRoute) {}
    `,
	});

	sections: NgbdOverview = {};

	constructor(demoList: NgbdDemoListService) {
		this.sections = demoList.getOverviewSections('nav');
	}
}
