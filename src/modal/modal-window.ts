import {DOCUMENT} from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';

import {NgbFocusTrap, NgbFocusTrapFactory} from '../util/focus-trap';
import {ModalDismissReasons} from './modal-dismiss-reasons';

@Component({
  selector: 'ngb-modal-window',
  host: {
    '[class]': '"modal fade show d-block" + (windowClass ? " " + windowClass : "")',
    'role': 'dialog',
    'tabindex': '-1',
    '(keyup.esc)': 'escKey($event)',
    '(click)': 'backdropClick($event)'
  },
  template: `
    <div [class]="'modal-dialog' + (size ? ' modal-' + size : '') + (centered ? ' modal-dialog-centered' : '')" role="document">
        <div #content class="modal-content"><ng-content></ng-content></div>
    </div>
    `
})
export class NgbModalWindow implements OnInit,
    AfterViewInit, OnDestroy {
  private _focusTrap: NgbFocusTrap | null = null;
  @ViewChild('content') private _trapWrapper;

  @Input() backdrop: boolean | string = true;
  @Input() centered: string;
  @Input() keyboard = true;
  @Input() size: string;
  @Input() windowClass: string;

  @Output('dismiss') dismissEvent = new EventEmitter();


  constructor(
      @Inject(DOCUMENT) private _document: Document, private _elRef: ElementRef, private _renderer: Renderer2,
      private _focusTrapFactory: NgbFocusTrapFactory) {}

  backdropClick($event): void {
    if (this.backdrop === true && this._elRef.nativeElement === $event.target) {
      this.dismiss(ModalDismissReasons.BACKDROP_CLICK);
    }
  }

  escKey($event): void {
    if (this.keyboard && !$event.defaultPrevented) {
      this.dismiss(ModalDismissReasons.ESC);
    }
  }

  dismiss(reason): void { this.dismissEvent.emit(reason); }

  ngOnInit() { this._renderer.addClass(this._document.body, 'modal-open'); }

  ngAfterViewInit() {
    this._focusTrap = this._focusTrapFactory.create(this._trapWrapper.nativeElement, true);
    if (!this._elRef.nativeElement.contains(document.activeElement)) {
      this._elRef.nativeElement['focus'].apply(this._elRef.nativeElement, []);
    }
  }

  ngOnDestroy() {
    this._focusTrap.destroy();
    this._focusTrap = null;
    this._renderer.removeClass(this._document.body, 'modal-open');
  }
}
