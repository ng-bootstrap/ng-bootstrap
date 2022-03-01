/* eslint-disable */
import {Directive} from '@angular/core';

/**
 * @deprecated 12.0.0 Please use native Angular code instead
 */
@Directive({
  selector: '[ngbButtonLabel]',
  host:
      {'[class.btn]': 'true', '[class.active]': 'active', '[class.disabled]': 'disabled', '[class.focus]': 'focused'}
})
export class NgbButtonLabel {
  active: boolean;
  disabled: boolean;
  focused: boolean;
}
