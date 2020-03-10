import {DOCUMENT} from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {fromEvent, Subject} from 'rxjs';
import {filter, switchMap, take, takeUntil, tap} from 'rxjs/operators';

import {getFocusableBoundaryElements} from '../util/focus-trap';
import {Key} from '../util/key';
import {ModalDismissReasons} from './modal-dismiss-reasons';

@Component({
  selector: 'ngb-modal-window',
  host: {
    '[class]': '"modal fade show d-block" + (windowClass ? " " + windowClass : "")',
    'role': 'dialog',
    'tabindex': '-1',
    '[attr.aria-modal]': 'true',
    '[attr.aria-labelledby]': 'ariaLabelledBy',
  },
  template: `
    <div #dialog [class]="'modal-dialog' + (size ? ' modal-' + size : '') + (centered ? ' modal-dialog-centered' : '') +
     (scrollable ? ' modal-dialog-scrollable' : '')" role="document">
        <div class="modal-content"><ng-content></ng-content></div>
    </div>
    `,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./modal.scss']
})
export class NgbModalWindow implements OnInit,
    AfterViewInit, OnDestroy {
  private _closed$ = new Subject<void>();
  private _elWithFocus: Element | null = null;  // element that is focused prior to modal opening

  @ViewChild('dialog', {static: true}) private _dialogEl: ElementRef<HTMLElement>;

  @Input() ariaLabelledBy: string;
  @Input() backdrop: boolean | string = true;
  @Input() centered: string;
  @Input() keyboard = true;
  @Input() scrollable: string;
  @Input() size: string;
  @Input() windowClass: string;

  @Output('dismiss') dismissEvent = new EventEmitter();

  constructor(
      @Inject(DOCUMENT) private _document: any, private _elRef: ElementRef<HTMLElement>, private _zone: NgZone) {}

  dismiss(reason): void { this.dismissEvent.emit(reason); }

  ngOnInit() { this._elWithFocus = this._document.activeElement; }

  ngAfterViewInit() {
    const {nativeElement} = this._elRef;
    this._zone.runOutsideAngular(() => {

      fromEvent<KeyboardEvent>(nativeElement, 'keydown')
          .pipe(
              takeUntil(this._closed$),
              // tslint:disable-next-line:deprecation
              filter(e => e.which === Key.Escape && this.keyboard))
          .subscribe(event => requestAnimationFrame(() => {
                       if (!event.defaultPrevented) {
                         this._zone.run(() => this.dismiss(ModalDismissReasons.ESC));
                       }
                     }));

      // We're listening to 'mousedown' and 'mouseup' to prevent modal from closing when pressing the mouse
      // inside the modal dialog and releasing it outside
      let preventClose = false;
      fromEvent<MouseEvent>(this._dialogEl.nativeElement, 'mousedown')
          .pipe(
              takeUntil(this._closed$), tap(() => preventClose = false),
              switchMap(() => fromEvent<MouseEvent>(nativeElement, 'mouseup').pipe(takeUntil(this._closed$), take(1))),
              filter(({target}) => nativeElement === target))
          .subscribe(() => { preventClose = true; });

      // We're listening to 'click' to dismiss modal on modal window click, except when:
      // 1. clicking on modal dialog itself
      // 2. closing was prevented by mousedown/up handlers
      // 3. clicking on scrollbar when the viewport is too small and modal doesn't fit (click is not triggered at all)
      fromEvent<MouseEvent>(nativeElement, 'click').pipe(takeUntil(this._closed$)).subscribe(({target}) => {
        if (this.backdrop === true && nativeElement === target && !preventClose) {
          this._zone.run(() => this.dismiss(ModalDismissReasons.BACKDROP_CLICK));
        }
        preventClose = false;
      });
    });

    if (!nativeElement.contains(document.activeElement)) {
      const autoFocusable = nativeElement.querySelector(`[ngbAutofocus]`) as HTMLElement;
      const firstFocusable = getFocusableBoundaryElements(nativeElement)[0];

      const elementToFocus = autoFocusable || firstFocusable || nativeElement;
      elementToFocus.focus();
    }
  }

  ngOnDestroy() {
    const body = this._document.body;
    const elWithFocus = this._elWithFocus;

    let elementToFocus;
    if (elWithFocus && elWithFocus['focus'] && body.contains(elWithFocus)) {
      elementToFocus = elWithFocus;
    } else {
      elementToFocus = body;
    }
    this._zone.runOutsideAngular(() => {
      setTimeout(() => elementToFocus.focus());
      this._elWithFocus = null;
    });

    this._closed$.next();
  }
}
