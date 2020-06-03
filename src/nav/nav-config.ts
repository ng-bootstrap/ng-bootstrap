import {Injectable} from '@angular/core';
import {NgbConfig} from '../ngb-config';

/**
 * A configuration service for the [`NgbNav`](#/components/nav/api#NgbNav) component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the navs used in the application.
 *
 * @since 5.2.0
 */
@Injectable({providedIn: 'root'})
export class NgbNavConfig {
  animation: boolean;
  destroyOnHide = true;
  orientation: 'horizontal' | 'vertical' = 'horizontal';
  roles: 'tablist' | false = 'tablist';
  keyboard: boolean | 'changeWithArrows' = false;

  constructor(ngbConfig: NgbConfig) { this.animation = ngbConfig.animation; }
}
