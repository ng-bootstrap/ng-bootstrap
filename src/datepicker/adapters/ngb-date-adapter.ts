import {Injectable} from '@angular/core';
import {NgbDate} from '../ngb-date';
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
   * Converts user-model date into an NgbDate for internal use in the library
   */
  abstract fromModel(value: D): NgbDate;

  /**
   * Converts internal date value NgbDate to user-model date
   * The returned type is supposed to be of the same type as fromModel() input-value param
   */
  abstract toModel(date: NgbDate): D;
}

@Injectable()
export class NgbDateDefaultAdapter extends NgbDateAdapter<NgbDateStruct> {
  /**
   * Converts a NgbDate value into NgbDate value
   */
  fromModel(date: NgbDateStruct): NgbDate {
    return (date && date.year && date.month && date.day) ? new NgbDate(date.year, date.month, date.day) : null;
  }

  /**
   * Converts a NgbDate value into NgbDate value
   */
  toModel(date: NgbDate): NgbDate { return (date && date.year && date.month && date.day) ? date : null; }
}
