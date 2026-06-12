import { Component, ChangeDetectionStrategy } from '@angular/core';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap/toast';

@Component({
	selector: 'ngbd-toast-inline',
	imports: [NgbToast],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './toast-inline.html',
})
export class NgbdToastInline {
	show = true;
}
