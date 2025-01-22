import {
	afterNextRender,
	Component,
	ElementRef,
	EventEmitter,
	inject,
	Injector,
	Input,
	NgZone,
	OnInit,
	Output,
	ViewEncapsulation,
} from '@angular/core';

import { Observable } from 'rxjs';

import { ngbRunTransition } from '../util/transition/ngbTransition';
import { reflow } from '../util/util';
import { OffcanvasDismissReasons } from './offcanvas-dismiss-reasons';

@Component({
	selector: 'ngb-offcanvas-backdrop',
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
	private _nativeElement = inject(ElementRef).nativeElement as HTMLElement;
	private _zone = inject(NgZone);
	private _injector = inject(Injector);

	@Input() animation: boolean;
	@Input() backdropClass: string;
	@Input() static: boolean;

	@Output('dismiss') dismissEvent = new EventEmitter();

	ngOnInit() {
		afterNextRender(
			{
				mixedReadWrite: () =>
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
					),
			},
			{ injector: this._injector },
		);
	}

	hide(): Observable<void> {
		return ngbRunTransition(this._zone, this._nativeElement, ({ classList }) => classList.remove('show'), {
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
