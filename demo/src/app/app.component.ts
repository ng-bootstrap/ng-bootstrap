import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
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
    router: Router,
    @Inject(DOCUMENT) document: any
  ) {
    router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        const { fragment } = router.parseUrl(router.url);
        if (fragment) {
          setTimeout(() => {
            const element = document.querySelector(`#${fragment}`);
            if (element) {
              element.scrollIntoView();
            }
          }, 0);
        } else {
          window.scrollTo({ top: 0 });
        }
      });
  }

  ngOnInit(): void {
    this._analytics.trackPageViews();
  }
}
