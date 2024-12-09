import { Component, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { NgbAlert, NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'ngbd-alert-selfclosing',
    imports: [NgbAlertModule],
    templateUrl: './alert-selfclosing.html'
})
export class NgbdAlertSelfclosing {
	private _message$ = new Subject<string>();

	staticAlertClosed = false;
	successMessage = '';

	@ViewChild('staticAlert', { static: false }) staticAlert: NgbAlert;
	@ViewChild('selfClosingAlert', { static: false }) selfClosingAlert: NgbAlert;

	constructor() {
		setTimeout(() => this.staticAlert.close(), 20000);

		this._message$
			.pipe(
				takeUntilDestroyed(),
				tap((message) => (this.successMessage = message)),
				debounceTime(5000),
			)
			.subscribe(() => this.selfClosingAlert?.close());
	}

	public changeSuccessMessage() {
		this._message$.next(`${new Date()} - Message successfully changed.`);
	}
}
