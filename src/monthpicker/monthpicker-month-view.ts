import { ChangeDetectionStrategy, Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { NgbMonth } from './ngb-month';
import { NgbMonthpickerI18n } from './monthpicker-i18n';

@Component({
	selector: '[ngbMonthpickerMonthView]',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	styleUrls: ['./monthpicker-month-view.scss'],
	host: {
		class: 'btn-light',
		'[class.bg-primary]': 'selected',
		'[class.text-white]': 'selected',
		'[class.text-muted]': 'isMuted()',
		'[class.outside]': 'isMuted()',
		'[class.active]': 'focused',
	},
	template: `{{ i18n.getMonthShortName(date?.month) }}`,
})
export class NgbMonthpickerMonthView {
	i18n = inject(NgbMonthpickerI18n);

	@Input() currentMonth: number;
	@Input() date: NgbMonth;
	@Input() disabled: boolean;
	@Input() focused: boolean;
	@Input() selected: boolean;

	isMuted() {
		return !this.selected && (this.date?.month !== this.currentMonth || this.disabled);
	}
}
