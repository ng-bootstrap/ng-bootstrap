import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {SideNavComponent} from './shared';

import '../style/app.scss';

@Component({
  selector: 'ngbd-app',
  directives: [...ROUTER_DIRECTIVES, SideNavComponent],
  template: require('./app.component.html')
})
export class AppComponent {}
