import { Component } from '@angular/core';
import { RouteConfig, ROUTER_DIRECTIVES } from '@angular/router-deprecated';

import { HomeComponent } from './home';
import { AccordionComponent } from './components/accordion';
import { SideNavComponent } from './shared';

import 'prismjs/themes/prism-okaidia.css';
import 'bootstrap/dist/css/bootstrap.css';
import '../style/app.scss';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'ngbd-app',
  directives: [...ROUTER_DIRECTIVES, SideNavComponent],
  template: require('./app.component.html')
})
@RouteConfig([
  {path: '/', component: HomeComponent, name: 'Home', useAsDefault: true},
  {path: '/components/accordion', component: AccordionComponent, name: 'Accordion'}
])
export class AppComponent { }
