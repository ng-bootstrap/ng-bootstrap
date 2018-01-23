import {Injectable} from '@angular/core';
import {NgbDateStruct} from './ngb-date-struct';

/**
 * Abstract type serving as a DI token for the service converting from your application Date model to internal
 * NgbDateStruct model.
 * A default implementation converting from and to NgbDateStruct is provided for retro-compatibility,
 * but you can provide another implementation to use an alternative format, ie for using with native Date Object.
 */
@Injectable()
export abstract class NgbDateAdapter<T> {
  /**
   * Converts user-model date into an NgbDateStruct for internal use in the library
   * @param  {any}     value any value that end user uses as the date model, ie: NgbDateStruct, Date, "yyyy-mm-dd"
   * @return {NgbDateStruct}
   */
  abstract fromModel(value: T): NgbDateStruct;

  /**
   * Converts internal date value NgbDateStruct to user-model date
   * The returned type is suposed to be of the same type as fromModel() input-value param
   * @param  {NgbDateStruct} date internal NgbDateStruct date representation
   * @return {any}
   */
  abstract toModel(date: NgbDateStruct): T;
}

@Injectable()
export class NgbDateStructAdapter extends NgbDateAdapter<NgbDateStruct> {
  /**
   * Converts a NgbDateStruct value into NgbDateStruct value
   * @param  {NgbDateStruct} value
   * @return {NgbDateStruct}
   */
  fromModel(date: NgbDateStruct): NgbDateStruct {
    return (date && date.year && date.month && date.day) ? {year: date.year, month: date.month, day: date.day} : null;
  }

  /**
   * Converts a NgbDateStruct value into NgbDateStruct value
   * @param  {NgbDateStruct} value
   * @return {NgbDateStruct}
   */
  toModel(date: NgbDateStruct): NgbDateStruct {
    return (date && date.year && date.month && date.day) ? {year: date.year, month: date.month, day: date.day} : null;
  }
}
