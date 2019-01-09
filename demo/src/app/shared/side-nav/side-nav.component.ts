import { Component } from '@angular/core';
import { Router } from '@angular/router';

export const componentsList = [
  'Accordion', 'Alert', 'Buttons', 'Carousel', 'Collapse', 'Datepicker', 'Dropdown', 'Modal', 'Pagination', 'Popover',
  'Progressbar', 'Rating', 'Table', 'Tabset', 'Timepicker', 'Tooltip', 'Typeahead'
];

@Component({
  selector: 'ngbd-side-nav',
  templateUrl: './side-nav.component.html',
})
export class SideNavComponent {
  components = componentsList;

  constructor(private router: Router) {}

  isActive(currentRoute: any[], exact = true): boolean {
    return this.router.isActive(this.router.createUrlTree(currentRoute), exact);
  }
}
