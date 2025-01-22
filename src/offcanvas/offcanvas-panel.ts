import {
	afterNextRender,
	Component,
	ElementRef,
	EventEmitter,
	inject,
	Injector,
	Input,
	NgZone,
	OnDestroy,
	OnInit,
	Output,
	ViewEncapsulation,
} from '@angular/core';

import { fromEvent, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { getFocusableBoundaryElements } from '../util/focus-trap';
import { OffcanvasDismissReasons } from './offcanvas-dismiss-reasons';
import { ngbRunTransition, NgbTransitionOptions } from '../util/transition/ngbTransition';
import { reflow } from '../util/util';
import { DOCUMENT } from '@angular/common';

@Component({
	selector: 'ngb-offcanvas-panel',
	template: '<ng-content />',
	encapsulation: ViewEncapsulation.None,
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
	private _document = inject(DOCUMENT);
	private _elRef = inject(ElementRef<HTMLElement>);
	private _zone = inject(NgZone);
	private _injector = inject(Injector);

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

	dismiss(reason): void {
		this.dismissEvent.emit(reason);
	}

	ngOnInit() {
		this._elWithFocus = this._document.activeElement;
		afterNextRender({ mixedReadWrite: () => this._show() }, { injector: this._injector });
	}

	ngOnDestroy() {
		this._disableEventHandling();
	}

	hide(): Observable<any> {
		const context: NgbTransitionOptions<any> = { animation: this.animation, runningTransition: 'stop' };

		const offcanvasTransition$ = ngbRunTransition(
			this._zone,
			this._elRef.nativeElement,
			(element) => {
				element.classList.remove('showing');
				element.classList.add('hiding');
				return () => element.classList.remove('show', 'hiding');
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
					filter((e) => e.key === 'Escape'),
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
