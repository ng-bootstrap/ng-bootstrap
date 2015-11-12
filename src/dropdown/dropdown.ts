import {Directive, Input} from 'angular2/angular2';

@Directive({selector: 'ngb-dropdown', host: {'class': 'dropdown', '[class.open]': 'open'}})
export class NgbDropdown {
  @Input() open: boolean;
}
