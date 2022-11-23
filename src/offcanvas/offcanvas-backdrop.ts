import { Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewEncapsulation } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { ngbRunTransition } from '../util/transition/ngbTransition';
import { reflow } from '../util/util';
import { OffcanvasDismissReasons } from './offcanvas-dismiss-reasons';

@Component({
	selector: 'ngb-offcanvas-backdrop',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: '',
	host: {
		'[class]': '"offcanvas-backdrop" + (backdropClass ? " " + backdropClass : "")',
		'[class.show]': '!animation',
		'[class.fade]': 'animation',
		'(mousedown)': 'dismiss()',
	},
})
export class NgbOffcanvasBackdrop implements OnInit {
	@Input() animation: boolean;
	@Input() backdropClass: string;
	@Input() static: boolean;

	@Output('dismiss') dismissEvent = new EventEmitter();

	constructor(private _el: ElementRef<HTMLElement>, private _zone: NgZone) {}

	ngOnInit() {
		this._zone.onStable
			.asObservable()
			.pipe(take(1))
			.subscribe(() => {
				ngbRunTransition(
					this._zone,
					this._el.nativeElement,
					(element: HTMLElement, animation: boolean) => {
						if (animation) {
							reflow(element);
						}
						element.classList.add('show');
					},
					{ animation: this.animation, runningTransition: 'continue' },
				);
			});
	}

	hide(): Observable<void> {
		return ngbRunTransition(this._zone, this._el.nativeElement, ({ classList }) => classList.remove('show'), {
			animation: this.animation,
			runningTransition: 'stop',
		});
	}

	dismiss() {
		if (!this.static) {
			this.dismissEvent.emit(OffcanvasDismissReasons.BACKDROP_CLICK);
		}
	}
}
