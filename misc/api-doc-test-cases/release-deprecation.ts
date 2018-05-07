import {Component, Directive, Injectable, Input, Output} from '@angular/core';

/**
 * Description
 *
 * @deprecated 2.0.0 description
 */
@Directive({
  selector: '[ngbDirective]'
})
export class NgbDirective {
  /**
   * Description
   *
   * @deprecated 2.0.0 description
   */
  @Input() input;

  /**
   * Description
   *
   * @deprecated 2.0.0 description
   */
  @Output() output;

  /**
   * Description
   *
   * @deprecated 2.0.0 description
   */
  property;

  /**
   * Description
   *
   * @deprecated 2.0.0 description
   */
  method() {}
}

/**
 * Description
 *
 * @deprecated 2.0.0 description
 */
@Component({
  selector: 'ngb-component'
})
export class NgbComponent {}


/**
 * Description
 *
 * @deprecated 2.0.0 description
 */
@Injectable()
export class NgbService {}

/**
 * Description
 *
 * @deprecated 2.0.0 description
 */
export class NgbClass {}

/**
 * Description
 *
 * @deprecated 2.0.0 description
 */
export interface NgbInterface {
}
