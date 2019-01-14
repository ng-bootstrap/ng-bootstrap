import {Component} from '@angular/core';
import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-chevron-span',
  templateUrl: './chevron-span.html',
  providers: [NgbPaginationConfig] // add NgbPaginationConfig to the component providers
})
export class NgbdChevronSpan {
  page = 1;
  constructor(config: NgbPaginationConfig) {
    // customize default values of paginations used by this component tree
    config.spanChevron = true;
  }
}
