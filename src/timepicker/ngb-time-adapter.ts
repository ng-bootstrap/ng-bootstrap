import {Injectable} from '@angular/core';
import {NgbTimeStruct} from './ngb-time-struct';
import {isInteger} from '../util/util';

/**
 * Abstract type serving as a DI token for the service converting from your application Time model to internal
 * NgbTimeStruct model.
 * A default implementation converting from and to NgbTimeStruct is provided for retro-compatibility,
 * but you can provide another implementation to use an alternative format, ie for using with native Date Object.
 */
@Injectable()
export abstract class NgbTimeAdapter<T> {
  /**
   * Converts user-model date into an NgbTimeStruct for internal use in the library
   * @param  {any}     value any value that end user uses as the time model, ie: NgbTimeStruct, Date, "HH:mm:ss"
   * @return {NgbTimeStruct}
   */
  abstract fromModel(value: T): NgbTimeStruct;

  /**
   * Converts internal time value NgbTimeStruct to user-model date
   * The returned type is suposed to be of the same type as fromModel() input-value param
   * @param  {NgbTimeStruct} time internal NgbTimeStruct date representation
   * @return {any}
   */
  abstract toModel(time: NgbTimeStruct): T;
}

@Injectable()
export class NgbTimeStructAdapter extends NgbTimeAdapter<NgbTimeStruct> {
  /**
   * Converts a NgbTimeStruct value into NgbTimeStruct value
   * @param  {NgbTimeStruct} value
   * @return {NgbTimeStruct}
   */
  fromModel(time: NgbTimeStruct): NgbTimeStruct {
    return (time && isInteger(time.hour) && isInteger(time.minute)) ?
        {hour: time.hour, minute: time.minute, second: isInteger(time.second) ? time.second : null} :
        null;
  }

  /**
   * Converts a NgbTimeStruct value into NgbTimeStruct value
   * @param  {NgbTimeStruct} value
   * @return {NgbTimeStruct}
   */
  toModel(time: NgbTimeStruct): NgbTimeStruct {
    return (time && isInteger(time.hour) && isInteger(time.minute)) ?
        {hour: time.hour, minute: time.minute, second: isInteger(time.second) ? time.second : null} :
        null;
  }
}
