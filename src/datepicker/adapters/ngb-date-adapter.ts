import {Injectable} from '@angular/core';
import {NgbDateStruct} from '../ngb-date-struct';
import {isInteger} from '../../util/util';

export function NGB_DATEPICKER_DATE_ADAPTER_FACTORY() {
  return new NgbDateStructAdapter();
}

/**
 * An abstract class used as the DI token that does conversion between the internal
 * datepicker NgbDateStruct model and any provided user date model, ex. string, native date, etc.
 *
 * Adapter is used for conversion when binding datepicker to a model with forms, ex. [(ngModel)]="userDateModel"
 *
 * Default implementation assumes NgbDateStruct for user model as well.
 */
@Injectable({providedIn: 'root', useFactory: NGB_DATEPICKER_DATE_ADAPTER_FACTORY})
export abstract class NgbDateAdapter<D> {
  /**
   * Converts user-model date into an NgbDateStruct for internal use in the library
   */
  abstract fromModel(value: D): NgbDateStruct;

  /**
   * Converts internal date value NgbDateStruct to user-model date
   * The returned type is supposed to be of the same type as fromModel() input-value param
   */
  abstract toModel(date: NgbDateStruct): D;
}

@Injectable()
export class NgbDateStructAdapter extends NgbDateAdapter<NgbDateStruct> {
  /**
   * Converts a NgbDateStruct value into NgbDateStruct value
   */
  fromModel(date: NgbDateStruct): NgbDateStruct {
    return (date && isInteger(date.year) && isInteger(date.month) && isInteger(date.day)) ?
        {year: date.year, month: date.month, day: date.day} :
        null;
  }

  /**
   * Converts a NgbDateStruct value into NgbDateStruct value
   */
  toModel(date: NgbDateStruct): NgbDateStruct {
    return (date && isInteger(date.year) && isInteger(date.month) && isInteger(date.day)) ?
        {year: date.year, month: date.month, day: date.day} :
        null;
  }
}
