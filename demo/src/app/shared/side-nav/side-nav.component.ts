import { Component } from '@angular/core';

export const componentsList = [
  'Accordion',
  'Alert',
  'Buttons',
  'Carousel',
  'Collapse',
  'Datepicker',
  'Dropdown',
  'Modal',
  'Pagination',
  'Popover',
  'Progressbar',
  'Rating',
  'Tabs',
  'Timepicker',
  'Tooltip',
  'Typeahead'
];

@Component({
  selector: 'ngbd-side-nav',
  templateUrl: './side-nav.component.html',
})
export class SideNavComponent {
  components = componentsList;
}
