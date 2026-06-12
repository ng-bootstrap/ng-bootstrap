import {Service} from '@angular/core';

/**
 * Service defining default values for progress bars
 */
@Service()
export class ProgressbarConfig {

  /**
   * Maximal value to be displayed in the progressbar.
   */
  max = 100;

  /**
   * Voluntarily left without a default value.
   */
  foo: string;

  private _dontExtract;

  /**
   * @internal
   */
  notForDocumentation;

  noDescriptionButStillExtract = 'sth';
}
