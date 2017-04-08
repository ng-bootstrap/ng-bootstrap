import {Component, OnInit} from '@angular/core';
import {Analytics} from './shared/analytics/analytics';
import {componentsList} from './shared';

import '../style/app.scss';

@Component({
  selector: 'ngbd-app',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  navbarCollapsed = true;

  components = componentsList;

  constructor(private _analytics: Analytics) {
  }

  ngOnInit(): void {
    this._analytics.trackPageViews();
  }
}
