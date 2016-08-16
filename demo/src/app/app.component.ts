import {Component} from '@angular/core';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';

import '../style/app.scss';

@Component({
  selector: 'ngbd-app',
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(private ga: Angulartics2GoogleAnalytics) {
    // we need to inject Angulartics2GoogleAnalytics due to:
    // https://github.com/ng-bootstrap/ng-bootstrap/issues/591
  }
}
