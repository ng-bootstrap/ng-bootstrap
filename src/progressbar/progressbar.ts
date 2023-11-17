import { ChangeDetectionStrategy, Component, HostBinding, inject, Input, ViewEncapsulation } from '@angular/core';
import { getValueInRange, isNumber } from '../util/util';
import { NgbProgressbarConfig } from './progressbar-config';
import { PercentPipe } from '@angular/common';

/**
 * A directive that provides feedback on the progress of a workflow or an action.
 */
@Component({
	selector: 'ngb-progressbar',
	standalone: true,
	imports: [PercentPipe],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		class: 'progress',
		role: 'progressbar',
		'[attr.aria-valuenow]': 'getValue()',
		'aria-valuemin': '0',
		'[attr.aria-valuemax]': 'max',
		'[attr.aria-label]': 'ariaLabel',
		'[style.width.%]': 'stacked ? getPercentValue() : null',
	},
	template: `
		<div
			class="progress-bar{{ type ? (textType ? ' bg-' + type : ' text-bg-' + type) : '' }}{{
				textType ? ' text-' + textType : ''
			}}"
			[class.progress-bar-animated]="animated"
			[class.progress-bar-striped]="striped"
			[style.width.%]="!stacked ? getPercentValue() : null"
		>
			@if (showValue) {
				<span i18n="@@ngb.progressbar.value">{{ getValue() / max | percent }}</span>
			}
			<ng-content />
		</div>
	`,
})
export class NgbProgressbar {
	private _config = inject(NgbProgressbarConfig);
	public stacked = inject(NgbProgressbarStacked, { optional: true });
	private _max: number;

	/**
	 * The maximal value to be displayed in the progress bar.
	 *
	 * Should be a positive number. Will default to 100 otherwise.
	 */
	@Input()
	set max(max: number) {
		this._max = !isNumber(max) || max <= 0 ? 100 : max;
	}

	get max(): number {
		return this._max;
	}

	/**
	 * If `true`, the stripes on the progress bar are animated.
	 *
	 * Takes effect only for browsers supporting CSS3 animations, and if `striped` is `true`.
	 */
	@Input() animated = this._config.animated;

	/**
	 * The accessible progress bar name.
	 *
	 * @since 13.1.0
	 */
	@Input() ariaLabel = this._config.ariaLabel;

	/**
	 * If `true`, the progress bars will be displayed as striped.
	 */
	@Input() striped = this._config.striped;

	/**
	 * If `true`, the current percentage will be shown in the `xx%` format.
	 */
	@Input() showValue = this._config.showValue;

	/**
	 * Optional text variant type of the progress bar.
	 *
	 * Supports types based on Bootstrap background color variants, like:
	 *  `"success"`, `"info"`, `"warning"`, `"danger"`, `"primary"`, `"secondary"`, `"dark"` and so on.
	 *
	 * @since 5.2.0
	 */
	@Input() textType = this._config.textType;

	/**
	 * The type of the progress bar.
	 *
	 * Supports types based on Bootstrap background color variants, like:
	 *  `"success"`, `"info"`, `"warning"`, `"danger"`, `"primary"`, `"secondary"`, `"dark"` and so on.
	 */
	@Input() type = this._config.type;

	/**
	 * The current value for the progress bar.
	 *
	 * Should be in the `[0, max]` range.
	 */
	@Input({ required: true }) value = 0;

	/**
	 * The height of the progress bar.
	 *
	 * Accepts any valid CSS height values, ex. `"2rem"`
	 */
	@Input() @HostBinding('style.height') height = this._config.height;

	constructor() {
		this.max = this._config.max;
	}

	getValue() {
		return getValueInRange(this.value, this.max);
	}

	getPercentValue() {
		return (100 * this.getValue()) / this.max;
	}
}

/**
 * A directive that allow to stack progress bars.
 *
 * @since 16.0.0
 */
@Component({
	selector: 'ngb-progressbar-stacked',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		class: 'progress-stacked',
	},
	template: `<ng-content></ng-content>`,
})
export class NgbProgressbarStacked {}
