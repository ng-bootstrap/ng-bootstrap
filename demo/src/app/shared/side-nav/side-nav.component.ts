import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  selector: 'ngbd-side-nav',
  template: require('./side-nav.component.html'),
  directives: [ROUTER_DIRECTIVES]
})
export class SideNavComponent {
  public components: Array<string> = [
    'Accordion',
    'Alert',
    'Buttons',
    'Carousel',
    'Collapse',
    'Dropdown',
    'Pager',
    'Pagination',
    'Popover',
    'Progressbar',
    'Rating',
    'Tabs',
    'Tooltip'
  ]
}
