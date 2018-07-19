import {Injectable} from '@angular/core';
import {NgbDateAdapter} from './ngb-date-adapter';
import {NgbDate} from '../ngb-date';

@Injectable()
export class NgbDateNativeAdapter extends NgbDateAdapter<Date> {
  fromModel(date: Date): NgbDate {
    return (date && date.getFullYear) ? new NgbDate(date.getFullYear(), date.getMonth() + 1, date.getDate()) : null;
  }

  toModel(date: NgbDate): Date {
    return date && date.year && date.month ? new Date(date.year, date.month - 1, date.day, 12) : null;
  }
}
