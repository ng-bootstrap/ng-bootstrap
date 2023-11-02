import { ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { NgbMonth } from './ngb-month';
import { NgbMonthpickerI18n } from './monthpicker-i18n';

@Component({
	selector: '[ngbDatepickerDayView]',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./datepicker-day-view.scss'],
	host: {
		class: 'btn-light',
		'[class.bg-primary]': 'selected',
		'[class.text-white]': 'selected',
		'[class.text-muted]': 'isMuted()',
		'[class.outside]': 'isMuted()',
		'[class.active]': 'focused',
	},
	template: `{{ i18n.getDayNumerals(date) }}`,
})
export class NgbDatepickerDayView {
	i18n = inject(NgbDatepickerI18n);

	@Input() currentMonth: number;
	@Input() date: NgbDate;
	@Input() disabled: boolean;
	@Input() focused: boolean;
	@Input() selected: boolean;

	isMuted() {
		return !this.selected && (this.date.month !== this.currentMonth || this.disabled);
	}
}
