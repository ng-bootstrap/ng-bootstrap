import {Injectable} from '@angular/core';
import {NgbDateAdapter} from './ngb-date-adapter';
import {NgbDateStruct} from '../ngb-date-struct';

@Injectable()
export class NgbDateNativeAdapter extends NgbDateAdapter<Date> {
  fromModel(date: Date): NgbDateStruct {
    return (date instanceof Date) ? {year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate()} : null;
  }

  toModel(date: NgbDateStruct): Date {
    return date && date.year && date.month ? new Date(date.year, date.month - 1, date.day, 12) : null;
  }
}
