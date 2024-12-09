import { Component } from '@angular/core';

import { Snippet } from '../../../services/snippet';
import { NgbAlertModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { CodeComponent } from '../../../shared/code.component';
import { RouterLink } from '@angular/router';
import { NgbdApiDocsBadge } from '../../../shared/api-docs';
import { PageHeaderComponent } from '../../../shared/page-header.component';
import { NgbdOverviewPage } from '../../../shared/overview-page/overview-page.class';

@Component({
    selector: 'ngbd-nav-overview',
    imports: [NgbNavModule, NgbAlertModule, CodeComponent, RouterLink, NgbdApiDocsBadge, PageHeaderComponent],
    templateUrl: './nav-overview.component.html',
    host: { '[class.overview]': 'true' }
})
export class NgbdNavOverviewComponent extends NgbdOverviewPage {
	BASIC = Snippet({
		lang: 'html',
		code: `
        <ul ngbNav #nav="ngbNav" class="nav-tabs">
          <li ngbNavItem>
            <button ngbNavLink>First</button>
            <ng-template ngbNavContent>First content</ng-template>
          </li>
          <li ngbNavItem>
            <button ngbNavLink>Second</button>
            <ng-template ngbNavContent>Second content</ng-template>
          </li>
        </ul>
        <div [ngbNavOutlet]="nav"></div>
    `,
	});

	MARKUP = Snippet({
		lang: 'html',
		code: `
        <!-- navs as list items -->
        <ul ngbNav class="nav-tabs">
          <li ngbNavItem>
            <button ngbNavLink>Button</button>
          </li>
          <li ngbNavItem>
            <a ngbNavLink>Link</a>
          </li>
        </ul>

        <!-- navs without list -->
        <div ngbNav class="nav-tabs">
          <ng-container ngbNavItem>
            <button ngbNavLink>Button</button>
          </ng-container>
          <ng-container ngbNavItem>
            <a ngbNavLink>Link</a>
          </ng-container>
        </div>
    `,
	});

	SELECTION = Snippet({
		lang: 'html',
		code: `
        <ul ngbNav [(activeId)]="activeId" class="nav-tabs">
          <li [ngbNavItem]="1">
            <button ngbNavLink>First</button>
          </li>
          <li [ngbNavItem]="2">
            <button ngbNavLink>Second</button>
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
        @for (link of links; track link) {
          <li [ngbNavItem]="link.fragment">
            <a ngbNavLink routerLink="." [fragment]="link.fragment">{{ link.title }}</a>
          </li>
          }
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
}
