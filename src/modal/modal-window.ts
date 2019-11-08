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
  ViewEncapsulation
} from '@angular/core';
import {fromEvent} from 'rxjs';
import {filter, map, takeUntil, withLatestFrom} from 'rxjs/operators';

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
    <div [class]="'modal-dialog' + (size ? ' modal-' + size : '') + (centered ? ' modal-dialog-centered' : '') +
     (scrollable ? ' modal-dialog-scrollable' : '')" role="document">
        <div class="modal-content"><ng-content></ng-content></div>
    </div>
    `,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./modal.scss']
})
export class NgbModalWindow implements OnInit,
    AfterViewInit, OnDestroy {
  private _elWithFocus: Element;  // element that is focused prior to modal opening

  @Input() ariaLabelledBy: string;
  @Input() backdrop: boolean | string = true;
  @Input() centered: string;
  @Input() keyboard = true;
  @Input() scrollable: string;
  @Input() size: string;
  @Input() windowClass: string;

  @Output('dismiss') dismissEvent = new EventEmitter();

  constructor(
      @Inject(DOCUMENT) private _document: any, private _elRef: ElementRef<HTMLElement>, private _zone: NgZone) {
    _zone.runOutsideAngular(() => {
      fromEvent<KeyboardEvent>(this._elRef.nativeElement, 'keydown')
          .pipe(
              takeUntil(this.dismissEvent),
              // tslint:disable-next-line:deprecation
              filter(e => e.which === Key.Escape && this.keyboard))
          .subscribe(event => requestAnimationFrame(() => {
                       if (!event.defaultPrevented) {
                         _zone.run(() => this.dismiss(ModalDismissReasons.ESC));
                       }
                     }));

      const mouseDowns$ = fromEvent<MouseEvent>(this._elRef.nativeElement, 'mousedown')
                              .pipe(
                                  takeUntil(this.dismissEvent),
                                  map(e => this.backdrop === true && this._elRef.nativeElement === e.target));

      fromEvent<MouseEvent>(this._elRef.nativeElement, 'mouseup')
          .pipe(takeUntil(this.dismissEvent), withLatestFrom(mouseDowns$), filter(([_, shouldClose]) => shouldClose))
          .subscribe(() => this._zone.run(() => this.dismiss(ModalDismissReasons.BACKDROP_CLICK)));
    });
  }

  dismiss(reason): void { this.dismissEvent.emit(reason); }

  ngOnInit() { this._elWithFocus = this._document.activeElement; }

  ngAfterViewInit() {
    if (!this._elRef.nativeElement.contains(document.activeElement)) {
      const autoFocusable = this._elRef.nativeElement.querySelector(`[ngbAutofocus]`) as HTMLElement;
      const firstFocusable = getFocusableBoundaryElements(this._elRef.nativeElement)[0];

      const elementToFocus = autoFocusable || firstFocusable || this._elRef.nativeElement;
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
  }
}
