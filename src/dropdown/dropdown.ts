import {Component, Directive, Input} from 'angular2/angular2';

@Component({
  selector: 'ngb-dropdown',
  template: `<div class="dropdown" [class.open]="open">
    <ng-content></ng-content>
  </div>`
})
export class NgbDropdown {
  @Input() private open: boolean;
}

@Directive({selector: 'ngb-dropdown-menu', host: {'class': 'dropdown-menu'}})
export class NgbDropdownMenu {
}
