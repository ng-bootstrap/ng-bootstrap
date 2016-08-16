import { Component } from '@angular/core';

@Component({
  selector: 'ngbd-side-nav',
  templateUrl: './side-nav.component.html',
})
export class SideNavComponent {
  public components: Array<string> = [
    'Accordion',
    'Alert',
    'Buttons',
    'Carousel',
    'Collapse',
    'Dropdown',
    'Pagination',
    'Popover',
    'Progressbar',
    'Rating',
    'Tabs',
    'Timepicker',
    'Tooltip',
    'Typeahead'
  ];
}
