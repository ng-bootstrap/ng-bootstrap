import {Component, Directive, Injectable, Input, Output} from '@angular/core';

/**
 * Description
 *
 * @since 2.0.0
 */
@Directive({
  selector: '[ngbDirective]'
})
export class NgbDirective {
  /**
   * Description
   *
   * @since 2.0.0
   */
  @Input() input;

  /**
   * Description
   *
   * @since 2.0.0
   */
  @Output() output;

  /**
   * Description
   *
   * @since 2.0.0
   */
  property;

  /**
   * Description
   *
   * @since 2.0.0
   */
  method() {}
}

/**
 * Description
 *
 * @since 2.0.0
 */
@Component({
  selector: 'ngb-component'
})
export class NgbComponent {}


/**
 * Description
 *
 * @since 2.0.0
 */
@Injectable()
export class NgbService {}

/**
 * Description
 *
 * @since 2.0.0
 */
export class NgbClass {}

/**
 * Description
 *
 * @since 2.0.0
 */
export interface NgbInterface {}
