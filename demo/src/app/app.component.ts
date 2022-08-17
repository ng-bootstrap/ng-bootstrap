import {ViewportScroller} from '@angular/common';
import {Component, NgZone, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {filter} from 'rxjs/operators';


import {componentsList} from './shared';
import {Analytics} from './shared/analytics/analytics';
import {NavOffcanvasComponent} from "./nav/nav-offcanvas.component";
import {SideNavOffcanvasComponent} from "./shared/side-nav/side-nav-offcanvas.component";
import {NgbOffcanvas} from "@ng-bootstrap/ng-bootstrap";


@Component({selector: 'ngbd-app', templateUrl: './app.component.html'})
export class AppComponent implements OnInit {
  navbarCollapsed = true;
  sidebarCollapsed = true;

  components = componentsList;

  constructor(
    private _analytics: Analytics, private offcanvasService: NgbOffcanvas, route: ActivatedRoute, vps: ViewportScroller, zone: NgZone) {
    route.fragment.pipe(filter(fragment => !!fragment))
      .subscribe((fragment: string) => zone.runOutsideAngular(() => requestAnimationFrame(() => vps.scrollToAnchor(fragment))));
  }

  ngOnInit(): void {
    this._analytics.trackPageViews();
  }

  openSidenavbar() {
    this.offcanvasService.open(SideNavOffcanvasComponent, {
      ariaLabelledBy: 'bdSidebarOffcanvasLabel',
      panelClass: 'd-lg-none',
      backdropClass: 'd-lg-none',
      scroll: true,
      position: 'start'
    });
  }

  openNavbar() {
    this.offcanvasService.open(NavOffcanvasComponent, {
      ariaLabelledBy: 'bdNavbarOffcanvasLabel',
      panelClass: 'bdNavbarBody d-lg-none',
      backdropClass: 'd-lg-none',
      scroll: true,
      position: 'end'
    });
  }
}
