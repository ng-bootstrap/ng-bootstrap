import {
  Component,
  Output,
  EventEmitter,
  Input,
  ElementRef,
  Renderer,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import {ModalDismissReasons} from './modal-dismiss-reasons';

@Component({
  selector: 'ngb-modal-window',
  host: {
    '[class]': '"modal fade in" + (windowClass ? " " + windowClass : "")',
    'role': 'dialog',
    'tabindex': '-1',
    'style': 'display: block;',
    '(keyup.esc)': 'escKey($event)',
    '(click)': 'backdropClick($event)'
  },
  template: `
    <div [class]="'modal-dialog' + (size ? ' modal-' + size : '')" role="document">
        <div class="modal-content" #modalContent><ng-content></ng-content></div>
    </div>
    `
})
export class NgbModalWindow implements OnInit,
    AfterViewInit, OnDestroy {
  private _elWithFocus: Element;  // element that is focused prior to modal opening

  @ViewChild('modalContent') contentEl: ElementRef;

  @Input() backdrop: boolean | string = true;
  @Input() keyboard = true;
  @Input() size: string;
  @Input() windowClass: string;

  @Output('dismiss') dismissEvent = new EventEmitter();

  constructor(private _elRef: ElementRef, private _renderer: Renderer) {}

  backdropClick($event): void {
    if (this.backdrop === true && !this.contentEl.nativeElement.contains($event.target)) {
      this.dismiss(ModalDismissReasons.BACKDROP_CLICK);
    }
  }

  escKey($event): void {
    if (this.keyboard && !$event.defaultPrevented) {
      this.dismiss(ModalDismissReasons.ESC);
    }
  }

  dismiss(reason): void { this.dismissEvent.emit(reason); }

  ngOnInit() {
    this._elWithFocus = document.activeElement;
    this._renderer.setElementClass(document.body, 'modal-open', true);
  }

  ngAfterViewInit() {
    if (!this._elRef.nativeElement.contains(document.activeElement)) {
      this._renderer.invokeElementMethod(this._elRef.nativeElement, 'focus', []);
    }
  }

  ngOnDestroy() {
    if (this._elWithFocus && document.body.contains(this._elWithFocus)) {
      this._renderer.invokeElementMethod(this._elWithFocus, 'focus', []);
    } else {
      this._renderer.invokeElementMethod(document.body, 'focus', []);
    }

    this._elWithFocus = null;
    this._renderer.setElementClass(document.body, 'modal-open', false);
  }
}
