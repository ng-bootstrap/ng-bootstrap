import {Component} from '@angular/core';

@Component({
  selector: 'ngbd-pagination-customization',
  templateUrl: './pagination-customization.html'
})
export class NgbdPaginationCustomization {
  page = 4;

  getPageSymbol(current: number) {
    return ['A', 'B', 'C', 'D', 'E', 'F', 'G'][current - 1];
  }
}
