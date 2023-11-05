import {
	Component,
	Input,
	Output,
	EventEmitter,
	ChangeDetectionStrategy,
	ViewEncapsulation,
	inject,
} from '@angular/core';
import { NavigationEvent, MonthViewModel } from './monthpicker-view-model';
import { NgbMonth } from './ngb-month';
import { NgbMonthpickerI18n } from './monthpicker-i18n';
import { NgFor, NgIf } from '@angular/common';
import { NgbMonthpickerNavigationSelect } from './monthpicker-navigation-select';

@Component({
	selector: 'ngb-monthpicker-navigation',
	standalone: true,
	imports: [NgIf, NgFor, NgbMonthpickerNavigationSelect],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./monthpicker-navigation.scss'],
	template: `
		<div class="ngb-mp-arrow ngb-mp-arrow-prev">
			<button
				type="button"
				class="btn btn-link ngb-mp-arrow-btn"
				(click)="onClickPrev($event)"
				[disabled]="prevDisabled"
				i18n-aria-label="@@ngb.monthpicker.previous-year"
				aria-label="Previous year"
				i18n-title="@@ngb.monthpicker.previous-year"
				title="Previous year"
			>
				<span class="ngb-mp-navigation-chevron"></span>
			</button>
		</div>
		<ngb-monthpicker-navigation-select
			*ngIf="showSelect"
			class="ngb-mp-navigation-select"
			[date]="date"
			[disabled]="disabled"
			[months]="selectBoxes.months"
			[years]="selectBoxes.years"
			(select)="select.emit($event)"
		>
		</ngb-monthpicker-navigation-select>

		<ng-template *ngIf="!showSelect" ngFor let-month [ngForOf]="months" let-i="index">
			<div class="ngb-mp-arrow" *ngIf="i > 0"></div>
			<div class="ngb-mp-month-name">
				{{ i18n.getMonthLabel(month.firstDate) }}
			</div>
			<div class="ngb-mp-arrow" *ngIf="i !== months.length - 1"></div>
		</ng-template>
		<div class="ngb-mp-arrow ngb-mp-arrow-next">
			<button
				type="button"
				class="btn btn-link ngb-mp-arrow-btn"
				(click)="onClickNext($event)"
				[disabled]="nextDisabled"
				i18n-aria-label="@@ngb.monthpicker.next-year"
				aria-label="Next year"
				i18n-title="@@ngb.monthpicker.next-year"
				title="Next year"
			>
				<span class="ngb-mp-navigation-chevron"></span>
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
