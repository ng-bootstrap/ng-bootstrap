import {
	AfterViewChecked,
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	EventEmitter,
	inject,
	Input,
	Output,
	ViewChild,
	ViewEncapsulation,
} from '@angular/core';
import { NgbMonth } from './ngb-month';
import { toInteger } from '../util/util';
import { NgbMonthpickerI18n } from './monthpicker-i18n';
import { NgFor } from '@angular/common';

@Component({
	selector: 'ngb-monthpicker-navigation-select',
	standalone: true,
	imports: [NgFor],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./monthpicker-navigation-select.scss'],
	template: `
		<select
			#year
			[disabled]="disabled"
			class="form-select"
			i18n-aria-label="@@ngb.monthpicker.select-year"
			aria-label="Select year"
			i18n-title="@@ngb.monthpicker.select-year"
			title="Select year"
			(change)="changeYear($any($event).target.value)"
		>
			<option *ngFor="let y of years" [value]="y">{{ i18n.getYearNumerals(y) }}</option>
		</select>
	`,
})
export class NgbMonthpickerNavigationSelect implements AfterViewChecked {
	private _year = -1;

	i18n = inject(NgbMonthpickerI18n);

	@Input() date: NgbMonth;
	@Input() disabled: boolean;
	@Input() months: number[];
	@Input() years: number[];

	@Output() select = new EventEmitter<NgbMonth>();

	@ViewChild('year', { static: true, read: ElementRef }) yearSelect: ElementRef<HTMLSelectElement>;

	changeMonth(month: string) {
		this.select.emit(new NgbMonth(this.date.year, toInteger(month)));
	}

	changeYear(year: string) {
		this.select.emit(new NgbMonth(toInteger(year), this.date.month));
	}

	ngAfterViewChecked() {
		if (this.date) {
			if (this.date.year !== this._year) {
				this._year = this.date.year;
				this.yearSelect.nativeElement.value = `${this._year}`;
			}
		}
	}
}
