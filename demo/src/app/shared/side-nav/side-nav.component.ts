import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {NgbActiveOffcanvas} from "@ng-bootstrap/ng-bootstrap";

export const componentsList = [
  'Accordion', 'Alert', 'Carousel', 'Collapse', 'Datepicker', 'Dropdown', 'Modal', 'Nav', 'Offcanvas', 'Pagination',
  'Popover', 'Progressbar', 'Rating', 'Table', 'Timepicker', 'Toast', 'Tooltip', 'Typeahead'
];

export const deprecatedComponentList: string[] = [];

@Component({
  selector: 'ngbd-side-nav',
  templateUrl: './side-nav.component.html',
})
export class SideNavComponent {
  components = componentsList;
  deprecatedComponents = deprecatedComponentList;

  public activeOffcanvas: NgbActiveOffcanvas | undefined;

  constructor(private router: Router) {}

  isActive(currentRoute: any[]): boolean {
    return this.router.isActive(this.router.createUrlTree(currentRoute), {
      paths: 'subset',
      queryParams: 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }

  onLinkClick(): void {
    this.activeOffcanvas?.close();
  }
}
