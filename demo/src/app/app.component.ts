import { ViewportScroller } from '@angular/common';
import { Component, NgZone, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

import { componentsList } from './shared';
import { Analytics } from './shared/analytics/analytics';

@Component({
  selector: 'ngbd-app',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  navbarCollapsed = true;

  components = componentsList;

  constructor(
    private _analytics: Analytics,
    route: ActivatedRoute,
    vps: ViewportScroller,
    zone: NgZone
  ) {
    route.fragment
      .pipe(filter(fragment => !!fragment))
      .subscribe(fragment => zone.runOutsideAngular(() => requestAnimationFrame(() => vps.scrollToAnchor(fragment))));
  }

  ngOnInit(): void {
    this._analytics.trackPageViews();
  }
}
