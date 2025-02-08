import {
	afterNextRender,
	ChangeDetectorRef,
	Component,
	ElementRef,
	inject,
	Injector,
	Input,
	NgZone,
	OnInit,
	ViewEncapsulation,
} from '@angular/core';

import { Observable } from 'rxjs';

import { ngbRunTransition } from '../util/transition/ngbTransition';
import { isDefined, reflow } from '../util/util';
import { NgbModalUpdatableOptions } from './modal-config';

const BACKDROP_ATTRIBUTES: string[] = ['animation', 'backdropClass'];

@Component({
	selector: 'ngb-modal-backdrop',
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
	private _injector = inject(Injector);
	private _cdRef = inject(ChangeDetectorRef);

	@Input() animation: boolean;
	@Input() backdropClass: string;

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

	updateOptions(options: NgbModalUpdatableOptions) {
		BACKDROP_ATTRIBUTES.forEach((optionName: string) => {
			if (isDefined(options[optionName])) {
				this[optionName] = options[optionName];
			}
		});
		this._cdRef.markForCheck();
	}
}
