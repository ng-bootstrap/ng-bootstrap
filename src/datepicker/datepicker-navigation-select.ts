import {
	AfterViewChecked,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	EventEmitter,
	inject,
	Input,
	Output,
	ViewChild,
	ViewEncapsulation,
} from '@angular/core';
import { NgbDate } from './ngb-date';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/utils';
import { NgbDatepickerI18n } from './datepicker-i18n';
import { NgbDatepickerConfig } from './datepicker-config';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'ngb-datepicker-navigation-select',
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	styleUrl: './datepicker-navigation-select.scss',
	template: `
		<select
			#month
			[disabled]="disabled"
			class="form-select"
			[attr.aria-label]="_config.selectMonthLabel"
			[title]="_config.selectMonthLabel"
			(change)="changeMonth($any($event).target.value)"
		>
			@for (m of months; track m) {
				<option [attr.aria-label]="i18n.getMonthFullName(m, date.year)" [value]="m">{{
					i18n.getMonthShortName(m, date.year)
				}}</option>
			}</select
		><select
			#year
			[disabled]="disabled"
			class="form-select"
			[attr.aria-label]="_config.selectYearLabel"
			[title]="_config.selectYearLabel"
			(change)="changeYear($any($event).target.value)"
		>
			@for (y of years; track y) {
				<option [value]="y">{{ i18n.getYearNumerals(y) }}</option>
			}
		</select>
	`,
})
export class NgbDatepickerNavigationSelect implements AfterViewChecked {
	private _month = -1;
	private _year = -1;

	_cd = inject(ChangeDetectorRef);
	_config = inject(NgbDatepickerConfig);
	i18n = inject(NgbDatepickerI18n);

	@Input() date: NgbDate;
	@Input() disabled: boolean;
	@Input() months: number[];
	@Input() years: number[];

	@Output() select = new EventEmitter<NgbDate>();

	@ViewChild('month', { static: true, read: ElementRef }) monthSelect: ElementRef<HTMLSelectElement>;
	@ViewChild('year', { static: true, read: ElementRef }) yearSelect: ElementRef<HTMLSelectElement>;

	changeMonth(month: string) {
		this.select.emit(new NgbDate(this.date.year, toInteger(month), 1));
	}

	changeYear(year: string) {
		this.select.emit(new NgbDate(toInteger(year), this.date.month, 1));
	}

	ngAfterViewChecked() {
		if (this.date) {
			if (this.date.month !== this._month) {
				this._month = this.date.month;
				this.monthSelect.nativeElement.value = `${this._month}`;
			}
			if (this.date.year !== this._year) {
				this._year = this.date.year;
				this.yearSelect.nativeElement.value = `${this._year}`;
			}
		}
	}

	constructor() {
		this._config.changes.pipe(takeUntilDestroyed()).subscribe(() => {
			this._cd.markForCheck();
		});
	}
}
