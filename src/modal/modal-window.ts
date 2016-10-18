import {
  Component,
  Output,
  EventEmitter,
  Input,
  ElementRef,
  Renderer,
  OnInit,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import {ModalDismissReasons} from './modal-dismiss-reasons';

let scrollbarWidth;

function getScrollbarWidth() {
  let tempDiv;
  if (scrollbarWidth === undefined) {
    tempDiv = document.createElement('div');
    tempDiv.innerHTML = '<div style="width:50px;height:50px;position:absolute;left:-50px;top:-50px;overflow:auto;"><div style="width:1px;height:100px;"></div></div>';
    tempDiv = tempDiv.firstChild;
    document.body.appendChild(tempDiv);
    scrollbarWidth = tempDiv.offsetWidth - tempDiv.clientWidth;
    document.body.removeChild(tempDiv);
  }
  return scrollbarWidth;
}

function isBodyOverflowing() {
  console.log(document.body.clientWidth, window.innerWidth);
  return document.body.clientWidth < window.innerWidth;
}

@Component({
  selector: 'ngb-modal-window',
  host: {
    '[class]': '"modal fade in" + (windowClass ? " " + windowClass : "")',
    'role': 'dialog',
    'tabindex': '-1',
    'style': 'display: block;',
    '(keyup.esc)': 'escKey($event)',
    '(click)': 'backdropClick()'
  },
  template: `
    <div [class]="'modal-dialog' + (size ? ' modal-' + size : '')" role="document">
        <div class="modal-content" (click)="stopPropagation($event)"><ng-content></ng-content></div>
    </div>
    `
})
export class NgbModalWindow implements OnInit,
    AfterViewInit, OnDestroy {
  private _elWithFocus: Element;  // element that is focused prior to modal opening
  private _originalBodyPadding: string;

  @Input() backdrop: boolean | string = true;
  @Input() keyboard = true;
  @Input() size: string;
  @Input() windowClass: string;

  @Output('dismiss') dismissEvent = new EventEmitter();

  constructor(private _elRef: ElementRef, private _renderer: Renderer) {}

  backdropClick(): void {
    if (this.backdrop === true) {
      this.dismiss(ModalDismissReasons.BACKDROP_CLICK);
    }
  }

  escKey($event): void {
    if (this.keyboard && !$event.defaultPrevented) {
      this.dismiss(ModalDismissReasons.ESC);
    }
  }

  dismiss(reason): void { this.dismissEvent.emit(reason); }

  stopPropagation($event: MouseEvent): void { $event.stopPropagation(); }

  ngOnInit() {
    this._elWithFocus = document.activeElement;

    this._hideScrollbars();
  }

  ngAfterViewInit() {
    if (!this._isNodeChildOfAnother(this._elRef.nativeElement, document.activeElement)) {
      this._renderer.invokeElementMethod(this._elRef.nativeElement, 'focus', []);
    }
  }

  ngOnDestroy() {
    if (this._elWithFocus && this._isNodeChildOfAnother(document.body, this._elWithFocus)) {
      this._renderer.invokeElementMethod(this._elWithFocus, 'focus', []);
    } else {
      this._renderer.invokeElementMethod(document.body, 'focus', []);
    }
    this._elWithFocus = null;

    this._restoreScrollbars();
  }

  private _isNodeChildOfAnother(parentNode, potentialChildNode) { return parentNode.contains(potentialChildNode); }

  private _hideScrollbars() {
    this._originalBodyPadding = document.body.style.paddingRight || '';

    console.log(isBodyOverflowing());
    if (isBodyOverflowing()) {
      this._renderer.setElementStyle(document.body, 'paddingRight', `${getScrollbarWidth()}px`);
    }
    this._renderer.setElementClass(document.body, 'modal-open', true);
  }

  private _restoreScrollbars() {
    this._renderer.setElementClass(document.body, 'modal-open', false);
    this._renderer.setElementStyle(document.body, 'paddingRight', this._originalBodyPadding);
  }
}
