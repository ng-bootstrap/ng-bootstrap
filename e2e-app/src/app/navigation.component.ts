import {Component} from '@angular/core';

import {routes} from './app.routing';

@Component({
  selector: 'app-navigation',
  template: `
  <div ngbDropdown class="d-inline-block">
    <button class="btn btn-outline-secondary" id="navigation-dropdown" ngbDropdownToggle>Open test suite</button>
    <div ngbDropdownMenu>
      <a *ngFor="let url of urls" href="#/{{ url }} " class="dropdown-item" id="navigate-{{ url.replace('/', '-') }}">{{ url }}</a>
    </div>
  </div>
  <a role="button" class="btn btn-outline-primary ml-3" id="navigate-home" href="#/">Reset</a>
  `
})

export class NavigationComponent {
  urls: string[] = [];

  constructor() {
    routes.forEach(route => route.children.forEach(childRoute => this.urls.push(`${route.path}/${childRoute.path}`)));
  }
}
