import {NgbDate} from './ngb-date';

/**
 * Interface of the model of the NgbDatepicker and NgbInputDatepicker directives
 *
 * @deprecated 3.0.0 Use NgbDate that provides additional comparison methods
 */
export interface NgbDateStruct {
  /**
   * The year, for example 2016
   */
  year: number;

  /**
   * The month, for example 1=Jan ... 12=Dec
   */
  month: number;

  /**
   * The day of month, starting at 1
   */
  day: number;

  equals?(other: NgbDate): boolean;

  before?(other: NgbDate): boolean;

  after?(other: NgbDate): boolean;

  toStruct?(): {year: number, month: number, day: number};

  toString?(): string;
}
