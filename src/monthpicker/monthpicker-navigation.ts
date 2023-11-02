import {
	Component,
	Input,
	Output,
	EventEmitter,
	ChangeDetectionStrategy,
	ViewEncapsulation,
	inject,
} from '@angular/core';
import { NavigationEvent, MonthViewModel } from './datepicker-view-model';
import { NgbMonth } from './ngb-month';
import { NgbMonthpickerI18n } from './monthpicker-i18n';
import { NgFor, NgIf } from '@angular/common';
import { NgbDatepickerNavigationSelect } from './monthpicker-navigation-select';

@Component({
	selector: 'ngb-monthpicker-navigation',
	standalone: true,
	imports: [NgIf, NgFor, NgbDatepickerNavigationSelect],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./monthpicker-navigation.scss'],
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
		<ngb-datepicker-navigation-select
			*ngIf="showSelect"
			class="ngb-dp-navigation-select"
			[date]="date"
			[disabled]="disabled"
			[months]="selectBoxes.months"
			[years]="selectBoxes.years"
			(select)="select.emit($event)"
		>
		</ngb-datepicker-navigation-select>

		<ng-template *ngIf="!showSelect" ngFor let-month [ngForOf]="months" let-i="index">
			<div class="ngb-dp-arrow" *ngIf="i > 0"></div>
			<div class="ngb-dp-month-name">
				{{ i18n.getMonthLabel(month.firstDate) }}
			</div>
			<div class="ngb-dp-arrow" *ngIf="i !== months.length - 1"></div>
		</ng-template>
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
export class NgbMonthpickerNavigation {
	navigation = NavigationEvent;

	i18n = inject(NgbMonthpickerI18n);

	@Input() date: NgbMonth;
	@Input() disabled: boolean;
	@Input() months: MonthViewModel[] = [];
	@Input() showSelect: boolean;
	@Input() prevDisabled: boolean;
	@Input() nextDisabled: boolean;
	@Input() selectBoxes: { years: number[]; months: number[] };

	@Output() navigate = new EventEmitter<NavigationEvent>();
	@Output() select = new EventEmitter<NgbMonth>();

	onClickPrev(event: MouseEvent) {
		(event.currentTarget as HTMLElement).focus();
		this.navigate.emit(this.navigation.PREV);
	}

	onClickNext(event: MouseEvent) {
		(event.currentTarget as HTMLElement).focus();
		this.navigate.emit(this.navigation.NEXT);
	}
}
