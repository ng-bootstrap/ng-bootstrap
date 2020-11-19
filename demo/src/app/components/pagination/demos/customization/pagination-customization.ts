import {Component} from '@angular/core';

const FILTER_PAG_REGEX = /[^0-9]/g;

@Component({
  selector: 'ngbd-pagination-customization',
  templateUrl: './pagination-customization.html'
})
export class NgbdPaginationCustomization {
  page = 4;

  getPageSymbol(current: number) {
    return ['A', 'B', 'C', 'D', 'E', 'F', 'G'][current - 1];
  }

  // User can apply the logic they want.
  applyPage(myInputPageValue: string) {
    const value = parseInt(myInputPageValue, 10) || 1;
    // You need to apply the value back to the pagination feature
    this.page = value;
  }

  // To allow only number in the input.
  formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(FILTER_PAG_REGEX, '');
  }
}
