import { Component } from '@angular/core';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'datepicker-component',
	standalone: true,
	imports: [FormsModule, NgbDatepickerModule],
	template: `
		<form class="row row-cols-lg-auto">
			<div class="col-12 mb-3 me-5">
				<ngb-datepicker [(ngModel)]="model1" name="inline" [startDate]="model1"></ngb-datepicker>
			</div>

			<div class="col-12 mb-3">
				<div class="input-group">
					<input
						class="form-control"
						placeholder="yyyy-mm-dd"
						name="popup"
						[(ngModel)]="model2"
						ngbDatepicker
						#d="ngbDatepicker"
					/>
					<button class="btn btn-outline-secondary" (click)="d.toggle()" type="button">Open</button>
				</div>
			</div>
		</form>
	`,
})
export class DatepickerComponent {
	model1 = { year: 1789, month: 7, day: 14 };
	model2 = { year: 1789, month: 7, day: 14 };
}
