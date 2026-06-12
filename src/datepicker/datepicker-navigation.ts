import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	inject,
	Input,
	Output,
	ViewEncapsulation,
} from '@angular/core';
import { MonthViewModel, NavigationEvent } from './datepicker-view-model';
import { NgbDate } from './ngb-date';
import { NgbDatepickerI18n } from './datepicker-i18n';
import { NgbDatepickerNavigationSelect } from './datepicker-navigation-select';
import { NgbDatepickerConfig } from './datepicker-config';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'ngb-datepicker-navigation',
	imports: [NgbDatepickerNavigationSelect],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	styleUrl: './datepicker-navigation.scss',
	template: `
		<div class="ngb-dp-arrow ngb-dp-arrow-prev">
			<button
				type="button"
				class="btn btn-link ngb-dp-arrow-btn"
				(click)="onClickPrev($event)"
				[disabled]="prevDisabled"
				[attr.aria-label]="_config.previousMonthLabel"
				[title]="_config.previousMonthLabel"
			>
				<span class="ngb-dp-navigation-chevron"></span>
			</button>
		</div>
		@if (showSelect) {
			<ngb-datepicker-navigation-select
				class="ngb-dp-navigation-select"
				[date]="date"
				[disabled]="disabled"
				[months]="selectBoxes.months"
				[years]="selectBoxes.years"
				(select)="select.emit($event)"
			/>
		}

		@if (!showSelect) {
			@for (month of months; track idMonth(month); let i = $index) {
				@if (i > 0) {
					<div class="ngb-dp-arrow"></div>
				}
				<div class="ngb-dp-month-name">
					{{ i18n.getMonthLabel(month.firstDate) }}
				</div>
				@if (i !== months.length - 1) {
					<div class="ngb-dp-arrow"></div>
				}
			}
		}
		<div class="visually-hidden" aria-live="polite">
			@for (month of months; track idMonth(month)) {
				<span>{{ i18n.getMonthLabel(month.firstDate) }}</span>
			}
		</div>

		<div class="ngb-dp-arrow ngb-dp-arrow-next">
			<button
				type="button"
				class="btn btn-link ngb-dp-arrow-btn"
				(click)="onClickNext($event)"
				[disabled]="nextDisabled"
				[attr.aria-label]="_config.nextMonthLabel"
				[title]="_config.nextMonthLabel"
			>
				<span class="ngb-dp-navigation-chevron"></span>
			</button>
		</div>
	`,
})
export class NgbDatepickerNavigation {
	navigation = NavigationEvent;

	_cd = inject(ChangeDetectorRef);
	_config = inject(NgbDatepickerConfig);
	i18n = inject(NgbDatepickerI18n);

	@Input() date: NgbDate;
	@Input() disabled: boolean;
	@Input() months: MonthViewModel[] = [];
	@Input() showSelect: boolean;
	@Input() prevDisabled: boolean;
	@Input() nextDisabled: boolean;
	@Input() selectBoxes: { years: number[]; months: number[] };

	@Output() navigate = new EventEmitter<NavigationEvent>();
	@Output() select = new EventEmitter<NgbDate>();

	onClickPrev(event: MouseEvent) {
		(event.currentTarget as HTMLElement).focus();
		this.navigate.emit(this.navigation.PREV);
	}

	onClickNext(event: MouseEvent) {
		(event.currentTarget as HTMLElement).focus();
		this.navigate.emit(this.navigation.NEXT);
	}

	idMonth(month: MonthViewModel) {
		return month;
	}

	constructor() {
		this._config.changes.pipe(takeUntilDestroyed()).subscribe(() => {
			this._cd.markForCheck();
		});
	}
}
