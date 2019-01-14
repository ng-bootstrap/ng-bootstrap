import {Component} from '@angular/core';
import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-pagination-chevron',
  templateUrl: './pagination-chevron.html',
  providers: [NgbPaginationConfig] // add NgbPaginationConfig to the component providers
})
export class NgbdPaginationChevron {
  page = 1;
  constructor(config: NgbPaginationConfig) {
    // customize default values of paginations used by this component tree
    config.spanChevron = false;
  }
}
