import {Directive, Input} from 'angular2/angular2';

@Directive({selector: 'ngb-dropdown', exportAs: 'ngbDropdown', host: {'[class.open]': 'open'}})
export class NgbDropdown {
  @Input() open: boolean;
}
