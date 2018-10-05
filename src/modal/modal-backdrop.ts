import {AfterViewInit, Component, Input, ViewEncapsulation, ElementRef, NgZone} from '@angular/core';
import {Observable} from 'rxjs';
import {NgbRunTransition} from '../util/transition/ngbTransition';
import {NgbPopupFadingTransition} from '../util/transition/ngbFadingTransition';
import {take} from 'rxjs/operators';

@Component({
  selector: 'ngb-modal-backdrop',
  encapsulation: ViewEncapsulation.None,
  template: '',
  host: {
    '[class]': '"modal-backdrop" + (backdropClass ? " " + backdropClass : "")',
    '[class.fade]': 'animation',
    'style': 'z-index: 1050'
  }
})
export class NgbModalBackdrop implements AfterViewInit {
  @Input() backdropClass: string;
  @Input() animation = false;

  constructor(private _elRef: ElementRef<HTMLElement>, private _zone: NgZone) {}

  ngAfterViewInit() {
    this._zone.onStable.pipe(take(1)).subscribe(() => {
      return NgbRunTransition(
          this._elRef.nativeElement, NgbPopupFadingTransition, {animation: this.animation, data: {showElement: true}});
    });
  }

  hide(): Observable<any> {
    return NgbRunTransition(
        this._elRef.nativeElement, NgbPopupFadingTransition, {animation: this.animation, data: {showElement: false}});
  }
}
