import {
  Component,
  Output,
  EventEmitter,
  Input,
  ElementRef,
  Renderer2,
  OnInit,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import {ModalDismissReasons} from './modal-dismiss-reasons';
import {trigger, transition, style, animate, useAnimation} from '@angular/animations';
import {fadeIn, fadeOut} from '../animations/fade';
import {AnimationsHelper} from '../util/animations-helper';

@Component({
  selector: 'ngb-modal-window',
  host: {
    '[class]': '"modal fade show" + (windowClass ? " " + windowClass : "")',
    'role': 'dialog',
    'tabindex': '-1',
    'style': 'display: block;',
    '(keyup.esc)': 'escKey($event)',
    '(click)': 'backdropClick($event)',
    '[@modalBackdrop]': 'animationsHelper.state',
    '(@modalBackdrop.done)': 'animationsHelper.stateChanges.next($event)'
  },
  template: `
    <div
      [@modalWindow]="animationsHelper.state"
      [class]="'modal-dialog' + (size ? ' modal-' + size : '')" 
      role="document">
        <div class="modal-content"><ng-content></ng-content></div>
    </div>
  `,
  animations: [
    trigger(
        'modalWindow',
        [
          transition(
              'void => enter',
              [
                style({transform: 'translate(0, -25%)'}),
                animate('.3s ease-out', style({transform: 'translate(0, 0)'}))
              ]),
          transition(
              'enter => exit',
              [
                style({transform: 'translate(0, 0)'}),
                animate('.3s ease-out', style({transform: 'translate(0, -25%)'}))
              ])
        ]),
    trigger(
        'modalBackdrop',
        [transition('void => enter', useAnimation(fadeIn)), transition('enter => exit', useAnimation(fadeOut))])
  ]
})
export class NgbModalWindow implements OnInit,
    AfterViewInit, OnDestroy {
  private _elWithFocus: Element;  // element that is focused prior to modal opening

  @Input() backdrop: boolean | string = true;
  @Input() keyboard = true;
  @Input() size: string;
  @Input() windowClass: string;

  @Output('dismiss') dismissEvent = new EventEmitter();

  animationsHelper = new AnimationsHelper();

  constructor(private _elRef: ElementRef, private _renderer: Renderer2) {}

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

  ngOnInit() {
    this._elWithFocus = document.activeElement;
    this._renderer.addClass(document.body, 'modal-open');
  }

  ngAfterViewInit() {
    if (!this._elRef.nativeElement.contains(document.activeElement)) {
      this._elRef.nativeElement['focus'].apply(this._elRef.nativeElement, []);
    }
  }

  ngOnDestroy() {
    const body = document.body;
    const elWithFocus = this._elWithFocus;

    let elementToFocus;
    if (elWithFocus && elWithFocus['focus'] && body.contains(elWithFocus)) {
      elementToFocus = elWithFocus;
    } else {
      elementToFocus = body;
    }
    elementToFocus['focus'].apply(elementToFocus, []);

    this._elWithFocus = null;
    this._renderer.removeClass(body, 'modal-open');
  }
}
