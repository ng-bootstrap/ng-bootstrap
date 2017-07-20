import {Directive, Renderer2, ElementRef} from '@angular/core';

@Directive({selector: '[ngbButtonLabel]', host: {'[class.btn]': 'true'}})
export class NgbButtonLabel {
  constructor(private _renderer: Renderer2, private _elRef: ElementRef) {}

  set active(isActive: boolean) {
    if (isActive) {
      this._renderer.addClass(this._elRef.nativeElement, 'active');
    } else {
      this._renderer.removeClass(this._elRef.nativeElement, 'active');
    }
  }

  set disabled(isDisabled: boolean) {
    if (isDisabled) {
      this._renderer.addClass(this._elRef.nativeElement, 'disabled');
    } else {
      this._renderer.removeClass(this._elRef.nativeElement, 'disabled');
    }
  }

  set focused(isFocused: boolean) {
    if (isFocused) {
      this._renderer.addClass(this._elRef.nativeElement, 'focus');
    } else {
      this._renderer.removeClass(this._elRef.nativeElement, 'focus');
    }
  }
}
