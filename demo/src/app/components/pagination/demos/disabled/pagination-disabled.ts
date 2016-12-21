import {Component} from '@angular/core';
import {NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-pagination-disabled',
  templateUrl: './pagination-disabled.html',
  providers: [NgbPaginationConfig] // add NgbPaginationConfig to the component providers
})
export class NgbdPaginationDisabled {
  page = 4;
  constructor(config: NgbPaginationConfig) { }
}
