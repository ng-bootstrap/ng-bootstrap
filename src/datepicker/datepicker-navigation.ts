import {
	ChangeDetectionStrategy,
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
				i18n-aria-label="@@ngb.datepicker.previous-month"
				aria-label="Previous month"
				i18n-title="@@ngb.datepicker.previous-month"
				title="Previous month"
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
			@for (month of months; track month; let i = $index) {
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
		<div class="ngb-dp-arrow ngb-dp-arrow-next">
			<button
				type="button"
				class="btn btn-link ngb-dp-arrow-btn"
				(click)="onClickNext($event)"
				[disabled]="nextDisabled"
				i18n-aria-label="@@ngb.datepicker.next-month"
				aria-label="Next month"
				i18n-title="@@ngb.datepicker.next-month"
				title="Next month"
			>
				<span class="ngb-dp-navigation-chevron"></span>
			</button>
		</div>
	`,
})
export class NgbDatepickerNavigation {
	navigation = NavigationEvent;

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
}
