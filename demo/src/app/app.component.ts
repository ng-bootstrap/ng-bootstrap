import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {Angulartics2, Angulartics2On} from 'angulartics2';
import {Angulartics2GoogleAnalytics} from 'angulartics2/src/providers/angulartics2-google-analytics';

import {SideNavComponent} from './shared';

import '../style/app.scss';

@Component({
  selector: 'ngbd-app',
  providers: [Angulartics2GoogleAnalytics],
  directives: [...ROUTER_DIRECTIVES, Angulartics2On, SideNavComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  constructor(angulartics2: Angulartics2, angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics) {}
}
