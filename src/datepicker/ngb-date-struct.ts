/**
 * Interface of the model of the NgbDatepicker and NgbInputDatepicker directives
 */
export interface NgbDateStruct {
  /**
   * The year, for example 2016
   */
  year: number;

  /**
   * The month, starting at 0 for January (in the gregorian calendar), to be consistent with the standard Date class
   */
  month: number;

  /**
   * The day of month, starting at 1
   */
  day: number;
}
