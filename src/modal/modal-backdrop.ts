import { Component, ElementRef, inject, Input, NgZone, OnInit, ViewEncapsulation } from '@angular/core';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { ngbRunTransition } from '../util/transition/ngbTransition';
import { reflow } from '../util/util';

@Component({
	selector: 'ngb-modal-backdrop',
	standalone: true,
	encapsulation: ViewEncapsulation.None,
	template: '',
	host: {
		'[class]': '"modal-backdrop" + (backdropClass ? " " + backdropClass : "")',
		'[class.show]': '!animation',
		'[class.fade]': 'animation',
		style: 'z-index: 1055',
	},
})
export class NgbModalBackdrop implements OnInit {
	private _nativeElement = inject(ElementRef).nativeElement as HTMLElement;
	private _zone = inject(NgZone);

	@Input() animation: boolean;
	@Input() backdropClass: string;

	ngOnInit() {
		this._zone.onStable
			.asObservable()
			.pipe(take(1))
			.subscribe(() => {
				ngbRunTransition(
					this._zone,
					this._nativeElement,
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
		return ngbRunTransition(this._zone, this._nativeElement, ({ classList }) => classList.remove('show'), {
			animation: this.animation,
			runningTransition: 'stop',
		});
	}
}
