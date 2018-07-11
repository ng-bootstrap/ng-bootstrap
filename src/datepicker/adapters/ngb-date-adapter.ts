import {Injectable} from '@angular/core';
import {NgbDateStruct} from '../ngb-date-struct';

/**
 * Abstract type serving as a DI token for the service converting from your application Date model to internal
 * NgbDateStruct model.
 * A default implementation converting from and to NgbDateStruct is provided for retro-compatibility,
 * but you can provide another implementation to use an alternative format, ie for using with native Date Object.
 */
@Injectable()
export abstract class NgbDateAdapter<D> {
  /**
   * Converts user-model date into an NgbDateStruct for internal use in the library
   */
  abstract fromModel(value: D): NgbDateStruct;

  /**
   * Converts internal date value NgbDateStruct to user-model date
   * The returned type is suposed to be of the same type as fromModel() input-value param
   */
  abstract toModel(date: NgbDateStruct): D;
}

@Injectable()
export class NgbDateStructAdapter extends NgbDateAdapter<NgbDateStruct> {
  /**
   * Converts a NgbDateStruct value into NgbDateStruct value
   */
  fromModel(date: NgbDateStruct): NgbDateStruct {
    return (date && date.year && date.month && date.day) ? {year: date.year, month: date.month, day: date.day} : null;
  }

  /**
   * Converts a NgbDateStruct value into NgbDateStruct value
   */
  toModel(date: NgbDateStruct): NgbDateStruct {
    return (date && date.year && date.month && date.day) ? {year: date.year, month: date.month, day: date.day} : null;
  }
}
