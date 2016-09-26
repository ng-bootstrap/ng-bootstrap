import {Component, Input} from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-datepicker-customday',
  templateUrl: './datepicker-customday.html',
  styles: [`
    .custom-day {      
      text-align: center;
      padding: 0.185rem 0.25rem;
      border-radius: 0.25rem;
      display: inline-block;
      width: 2rem;
    }
    .custom-day:hover {
      background-color: #e6e6e6;
    }
    .weekend {
      background-color: #f0ad4e;
      border-radius: 1rem;
      color: white;
    }
  `]
})
export class NgbdDatepickerCustomDay {
  model: NgbDateStruct;

  isWeekend(date: NgbDateStruct) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.getDay() === 0 || d.getDay() === 6;
  }
}
