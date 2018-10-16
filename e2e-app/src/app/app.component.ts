import {Component} from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>ng-bootstrap e2e test application</h1>
    <hr>
    <app-navigation></app-navigation>
    <hr>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
}
