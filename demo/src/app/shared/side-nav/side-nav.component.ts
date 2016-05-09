import { Component } from '@angular/core';
import { RouterLink } from '@angular/router-deprecated';

@Component({
  selector: 'ngbd-side-nav',
  template: require('./side-nav.component.html'),
  directives: [RouterLink]
})
export class SideNavComponent { }
