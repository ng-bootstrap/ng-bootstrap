import {Injectable} from '@angular/core';
import {NgbDateAdapter} from './ngb-date-adapter';
import {NgbDateStruct} from '../ngb-date-struct';

@Injectable()
export class NgbDateNativeUTCAdapter extends NgbDateAdapter<Date> {
  fromModel(date: Date): NgbDateStruct {
    return (date instanceof Date) ?
        {year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate()} :
        null;
  }

  toModel(date: NgbDateStruct): Date {
    return date && date.year && date.month ? new Date(Date.UTC(date.year, date.month - 1, date.day)) : null;
  }
}
