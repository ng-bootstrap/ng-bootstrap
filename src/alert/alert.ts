import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	inject,
	Input,
	NgZone,
	Output,
	ViewEncapsulation,
} from '@angular/core';

import { Observable } from 'rxjs';

import { NgbAlertConfig } from './alert-config';
import { ngbRunTransition } from '@ng-bootstrap/ng-bootstrap/utils';
import { ngbAlertFadingTransition } from './alert-transition';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

/**
 * Alert is a component to provide contextual feedback messages for user.
 *
 * It supports several alert types and can be dismissed.
 */
@Component({
	selector: 'ngb-alert',
	exportAs: 'ngbAlert',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		role: 'alert',
		'[class]': '"alert show" + (type ? " alert-" + type : "")',
		'[class.fade]': 'animation',
		'[class.alert-dismissible]': 'dismissible',
	},
	template: `
		<ng-content />
		@if (dismissible) {
			<button
				type="button"
				class="btn-close"
				[attr.aria-label]="_config.closeLabel"
				(click)="close()"
			></button>
		}
	`,
	styleUrl: './alert.scss',
})
export class NgbAlert {
	protected _config = inject(NgbAlertConfig);
	private _elementRef = inject(ElementRef<HTMLElement>);
	private _cd = inject(ChangeDetectorRef);
	private _zone = inject(NgZone);

	/**
	 * If `true`, alert closing will be animated.
	 *
	 * Animation is triggered only when clicked on the close button (×)
	 * or via the `.close()` function
	 *
	 * @since 8.0.0
	 */
	@Input() animation = this._config.animation;

	/**
	 * If `true`, alert can be dismissed by the user.
	 *
	 * The close button (×) will be displayed and you can be notified
	 * of the event with the `(closed)` output.
	 */
	@Input() dismissible = this._config.dismissible;

	/**
	 * Type of the alert.
	 *
	 * Bootstrap provides styles for the following types: `'success'`, `'info'`, `'warning'`, `'danger'`, `'primary'`,
	 * `'secondary'`, `'light'` and `'dark'`.
	 */
	@Input() type = this._config.type;

	/**
	 * An event emitted when the close button is clicked. It has no payload and only relevant for dismissible alerts.
	 *
	 * @since 8.0.0
	 */
	@Output() closed = new EventEmitter<void>();

	/**
	 * Triggers alert closing programmatically (same as clicking on the close button (×)).
	 *
	 * The returned observable will emit and be completed once the closing transition has finished.
	 * If the animations are turned off this happens synchronously.
	 *
	 * Alternatively you could listen or subscribe to the `(closed)` output
	 *
	 * @since 8.0.0
	 */
	close(): Observable<void> {
		const transition = ngbRunTransition(this._zone, this._elementRef.nativeElement, ngbAlertFadingTransition, {
			animation: this.animation,
			runningTransition: 'continue',
		});
		transition.subscribe(() => this.closed.emit());
		return transition;
	}

	constructor() {
		this._config.changes.pipe(
			takeUntilDestroyed()
		).subscribe(() => {
			this._cd.markForCheck();
		});
	}
}
