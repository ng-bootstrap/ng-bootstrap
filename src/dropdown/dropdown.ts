import {Directive, Input} from 'angular2/angular2';

@Directive({selector: 'ngb-dropdown', inputs: ['open'], host: {'class': 'dropdown', '[class.open]': 'open'}})
export class NgbDropdown {
  @Input() private open: boolean;
}
