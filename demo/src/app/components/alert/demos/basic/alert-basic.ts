import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap/alert';

@Component({
	selector: 'ngbd-alert-basic',
	imports: [NgbAlert],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './alert-basic.html',
})
export class NgbdAlertBasic {}
