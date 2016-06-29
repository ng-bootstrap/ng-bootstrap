import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
  selector: 'ngbd-default',
  directives: [ROUTER_DIRECTIVES],
  template: require('./default.component.html')
})
export class DefaultComponent {}
