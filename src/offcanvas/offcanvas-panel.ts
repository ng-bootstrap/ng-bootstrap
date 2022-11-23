import { DOCUMENT } from '@angular/common';
import {
	Component,
	ElementRef,
	EventEmitter,
	Inject,
	Input,
	NgZone,
	OnDestroy,
	OnInit,
	Output,
	ViewEncapsulation,
} from '@angular/core';

import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { getFocusableBoundaryElements } from '../util/focus-trap';
import { Key } from '../util/key';
import { OffcanvasDismissReasons } from './offcanvas-dismiss-reasons';
import { ngbRunTransition, NgbTransitionOptions } from '../util/transition/ngbTransition';
import { reflow } from '../util/util';

@Component({
	selector: 'ngb-offcanvas-panel',
	standalone: true,
	template: '<ng-content></ng-content>',
	encapsulation: ViewEncapsulation.None,
	styleUrls: [],
	host: {
		'[class]': '"offcanvas offcanvas-" + position  + (panelClass ? " " + panelClass : "")',
		role: 'dialog',
		tabindex: '-1',
		'[attr.aria-modal]': 'true',
		'[attr.aria-labelledby]': 'ariaLabelledBy',
		'[attr.aria-describedby]': 'ariaDescribedBy',
	},
})
export class NgbOffcanvasPanel implements OnInit, OnDestroy {
	private _closed$ = new Subject<void>();
	private _elWithFocus: Element | null = null; // element that is focused prior to offcanvas opening

	@Input() animation: boolean;
	@Input() ariaLabelledBy?: string;
	@Input() ariaDescribedBy?: string;
	@Input() keyboard = true;
	@Input() panelClass: string;
	@Input() position: 'start' | 'end' | 'top' | 'bottom' = 'start';

	@Output('dismiss') dismissEvent = new EventEmitter();

	shown = new Subject<void>();
	hidden = new Subject<void>();

	constructor(
		@Inject(DOCUMENT) private _document: any,
		private _elRef: ElementRef<HTMLElement>,
		private _zone: NgZone,
	) {}

	dismiss(reason): void {
		this.dismissEvent.emit(reason);
	}

	ngOnInit() {
		this._elWithFocus = this._document.activeElement;
		this._zone.onStable
			.asObservable()
			.pipe(take(1))
			.subscribe(() => {
				this._show();
			});
	}

	ngOnDestroy() {
		this._disableEventHandling();
	}

	hide(): Observable<any> {
		const { nativeElement } = this._elRef;
		const context: NgbTransitionOptions<any> = { animation: this.animation, runningTransition: 'stop' };

		const offcanvasTransition$ = ngbRunTransition(
			this._zone,
			this._elRef.nativeElement,
			(element) => {
				nativeElement.classList.remove('showing');
				nativeElement.classList.add('hiding');
				return () => nativeElement.classList.remove('show', 'hiding');
			},
			context,
		);

		offcanvasTransition$.subscribe(() => {
			this.hidden.next();
			this.hidden.complete();
		});

		this._disableEventHandling();
		this._restoreFocus();

		return offcanvasTransition$;
	}

	private _show() {
		const context: NgbTransitionOptions<any> = { animation: this.animation, runningTransition: 'continue' };

		const offcanvasTransition$ = ngbRunTransition(
			this._zone,
			this._elRef.nativeElement,
			(element: HTMLElement, animation: boolean) => {
				if (animation) {
					reflow(element);
				}
				element.classList.add('show', 'showing');
				return () => element.classList.remove('showing');
			},
			context,
		);

		offcanvasTransition$.subscribe(() => {
			this.shown.next();
			this.shown.complete();
		});

		this._enableEventHandling();
		this._setFocus();
	}

	private _enableEventHandling() {
		const { nativeElement } = this._elRef;
		this._zone.runOutsideAngular(() => {
			fromEvent<KeyboardEvent>(nativeElement, 'keydown')
				.pipe(
					takeUntil(this._closed$),
					/* eslint-disable-next-line deprecation/deprecation */
					filter((e) => e.which === Key.Escape),
				)
				.subscribe((event) => {
					if (this.keyboard) {
						requestAnimationFrame(() => {
							if (!event.defaultPrevented) {
								this._zone.run(() => this.dismiss(OffcanvasDismissReasons.ESC));
							}
						});
					}
				});
		});
	}

	private _disableEventHandling() {
		this._closed$.next();
	}

	private _setFocus() {
		const { nativeElement } = this._elRef;
		if (!nativeElement.contains(document.activeElement)) {
			const autoFocusable = nativeElement.querySelector(`[ngbAutofocus]`) as HTMLElement;
			const firstFocusable = getFocusableBoundaryElements(nativeElement)[0];

			const elementToFocus = autoFocusable || firstFocusable || nativeElement;
			elementToFocus.focus();
		}
	}

	private _restoreFocus() {
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
