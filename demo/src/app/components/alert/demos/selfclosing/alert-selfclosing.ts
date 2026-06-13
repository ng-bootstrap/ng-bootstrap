import { Component, signal, viewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap/alert';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
	selector: 'ngbd-alert-selfclosing',
	imports: [NgbAlert],
	templateUrl: './alert-selfclosing.html',
})
export class NgbdAlertSelfclosing {
	private _message$ = new Subject<string>();

	readonly staticAlertClosed = signal(false);
	readonly successMessage = signal('');

	readonly staticAlert = viewChild<NgbAlert>('staticAlert');
	readonly selfClosingAlert = viewChild<NgbAlert>('selfClosingAlert');

	constructor() {
		setTimeout(() => this.staticAlert()?.close(), 20000);

		this._message$
			.pipe(
				takeUntilDestroyed(),
				tap((message) => this.successMessage.set(message)),
				debounceTime(5000),
			)
			.subscribe(() => this.selfClosingAlert()?.close());
	}

	public changeSuccessMessage() {
		this._message$.next(`${new Date()} - Message successfully changed.`);
	}
}
