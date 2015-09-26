import {Component, View} from 'angular2/angular2';

@Component({selector: 'ngb-dropdown', properties: ['open']})
@View({
  template: `<div class="dropdown" [class.open]="open">
    <ng-content></ng-content>
  </div>`
})
export class NgbDropdown {
  private open: boolean;
}

@Component({selector: 'ngb-dropdown-menu', host: {class: 'dropdown-menu'}})
@View({template: `<ng-content></ng-content>`})
export class NgbDropdownMenu {
}
