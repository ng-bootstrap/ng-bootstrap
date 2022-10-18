import { ComponentRef } from '@angular/core';

import { Observable, of, Subject, zip } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ContentRef } from '../util/popup';
import { isPromise } from '../util/util';
import { NgbOffcanvasBackdrop } from './offcanvas-backdrop';
import { NgbOffcanvasPanel } from './offcanvas-panel';

/**
 * A reference to the currently opened (active) offcanvas.
 *
 * Instances of this class can be injected into your component passed as offcanvas content.
 * So you can `.close()` or `.dismiss()` the offcanvas window from your component.
 *
 * @since 12.1.0
 */
export class NgbActiveOffcanvas {
	/**
	 * Closes the offcanvas with an optional `result` value.
	 *
	 * The `NgbOffcanvasRef.result` promise will be resolved with the provided value.
	 */
	close(result?: any): void {}

	/**
	 * Dismisses the offcanvas with an optional `reason` value.
	 *
	 * The `NgbOffcanvasRef.result` promise will be rejected with the provided value.
	 */
	dismiss(reason?: any): void {}
}

/**
 * A reference to the newly opened offcanvas returned by the `NgbOffcanvas.open()` method.
 *
 * @since 12.1.0
 */
export class NgbOffcanvasRef {
	private _closed = new Subject<any>();
	private _dismissed = new Subject<any>();
	private _hidden = new Subject<void>();
	private _resolve: (result?: any) => void;
	private _reject: (reason?: any) => void;

	/**
	 * The instance of a component used for the offcanvas content.
	 *
	 * When a `TemplateRef` is used as the content or when the offcanvas is closed, will return `undefined`.
	 */
	get componentInstance(): any {
		if (this._contentRef && this._contentRef.componentRef) {
			return this._contentRef.componentRef.instance;
		}
	}

	/**
	 * The promise that is resolved when the offcanvas is closed and rejected when the offcanvas is dismissed.
	 */
	result: Promise<any>;

	/**
	 * The observable that emits when the offcanvas is closed via the `.close()` method.
	 *
	 * It will emit the result passed to the `.close()` method.
	 */
	get closed(): Observable<any> {
		return this._closed.asObservable().pipe(takeUntil(this._hidden));
	}

	/**
	 * The observable that emits when the offcanvas is dismissed via the `.dismiss()` method.
	 *
	 * It will emit the reason passed to the `.dismissed()` method by the user, or one of the internal
	 * reasons like backdrop click or ESC key press.
	 */
	get dismissed(): Observable<any> {
		return this._dismissed.asObservable().pipe(takeUntil(this._hidden));
	}

	/**
	 * The observable that emits when both offcanvas window and backdrop are closed and animations were finished.
	 * At this point offcanvas and backdrop elements will be removed from the DOM tree.
	 *
	 * This observable will be completed after emitting.
	 */
	get hidden(): Observable<void> {
		return this._hidden.asObservable();
	}

	/**
	 * The observable that emits when offcanvas is fully visible and animation was finished.
	 * The offcanvas DOM element is always available synchronously after calling 'offcanvas.open()' service.
	 *
	 * This observable will be completed after emitting.
	 * It will not emit, if offcanvas is closed before open animation is finished.
	 */
	get shown(): Observable<void> {
		return this._panelCmptRef.instance.shown.asObservable();
	}

	constructor(
		private _panelCmptRef: ComponentRef<NgbOffcanvasPanel>,
		private _contentRef: ContentRef,
		private _backdropCmptRef?: ComponentRef<NgbOffcanvasBackdrop>,
		private _beforeDismiss?: () => boolean | Promise<boolean>,
	) {
		_panelCmptRef.instance.dismissEvent.subscribe((reason: any) => {
			this.dismiss(reason);
		});
		if (_backdropCmptRef) {
			_backdropCmptRef.instance.dismissEvent.subscribe((reason: any) => {
				this.dismiss(reason);
			});
		}
		this.result = new Promise((resolve, reject) => {
			this._resolve = resolve;
			this._reject = reject;
		});
		this.result.then(null, () => {});
	}

	/**
	 * Closes the offcanvas with an optional `result` value.
	 *
	 * The `NgbMobalRef.result` promise will be resolved with the provided value.
	 */
	close(result?: any): void {
		if (this._panelCmptRef) {
			this._closed.next(result);
			this._resolve(result);
			this._removeOffcanvasElements();
		}
	}

	private _dismiss(reason?: any) {
		this._dismissed.next(reason);
		this._reject(reason);
		this._removeOffcanvasElements();
	}

	/**
	 * Dismisses the offcanvas with an optional `reason` value.
	 *
	 * The `NgbOffcanvasRef.result` promise will be rejected with the provided value.
	 */
	dismiss(reason?: any): void {
		if (this._panelCmptRef) {
			if (!this._beforeDismiss) {
				this._dismiss(reason);
			} else {
				const dismiss = this._beforeDismiss();
				if (isPromise(dismiss)) {
					dismiss.then(
						(result) => {
							if (result !== false) {
								this._dismiss(reason);
							}
						},
						() => {},
					);
				} else if (dismiss !== false) {
					this._dismiss(reason);
				}
			}
		}
	}

	private _removeOffcanvasElements() {
		const panelTransition$ = this._panelCmptRef.instance.hide();
		const backdropTransition$ = this._backdropCmptRef ? this._backdropCmptRef.instance.hide() : of(undefined);

		// hiding panel
		panelTransition$.subscribe(() => {
			const { nativeElement } = this._panelCmptRef.location;
			nativeElement.parentNode.removeChild(nativeElement);
			this._panelCmptRef.destroy();

			if (this._contentRef && this._contentRef.viewRef) {
				this._contentRef.viewRef.destroy();
			}

			this._panelCmptRef = <any>null;
			this._contentRef = <any>null;
		});

		// hiding backdrop
		backdropTransition$.subscribe(() => {
			if (this._backdropCmptRef) {
				const { nativeElement } = this._backdropCmptRef.location;
				nativeElement.parentNode.removeChild(nativeElement);
				this._backdropCmptRef.destroy();
				this._backdropCmptRef = <any>null;
			}
		});

		// all done
		zip(panelTransition$, backdropTransition$).subscribe(() => {
			this._hidden.next();
			this._hidden.complete();
		});
	}
}
