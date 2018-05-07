import {Component} from '@angular/core';

@Component({
  selector: 'ngbd-datepicker-multiple',
  templateUrl: './datepicker-multiple.html',
  styles: [`
    select.custom-select {
      margin-right: 0.5rem;
      width: auto;
    }
  `]
})
export class NgbdDatepickerMultiple {

  displayMonths = 2;
  navigation = 'select';
  showWeekNumbers = false;
}
