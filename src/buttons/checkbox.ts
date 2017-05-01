import {Directive, Input, Optional, Renderer2, ElementRef} from "@angular/core";
import {NgbActiveLabel} from "./label";

/**
 * Marks an input of type "checkbox" as part of the NgbRadioGroup.
 */
@Directive({
  selector: 'input[type=checkbox]',
  host: {
    '[disabled]': 'disabled',
    '(focus)': 'focused = true',
    '(blur)': 'focused = false'
  }
})
export class NgbCheckbox {
  private _disabled: boolean;

  /**
   * A flag indicating if a given checkbox button is disabled.
   */
  @Input('disabled')
  set disabled(isDisabled: boolean) {
    this._disabled = isDisabled !== false;
    if (this._label) {
      this._label.disabled = this._disabled;
    }
  }

  set focused(isFocused: boolean) {

    if (this._label) {
      this._label.focused = isFocused;
    }
  }

  get disabled() {
    return this._disabled;
  }

  constructor(@Optional() private _label: NgbActiveLabel, private _renderer: Renderer2, private _element: ElementRef) {
  }

}
