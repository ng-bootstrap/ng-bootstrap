import { Component, signal } from '@angular/core';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap/alert';

interface Alert {
	type: string;
	message: string;
}

const ALERTS: Alert[] = [
	{
		type: 'success',
		message: 'This is an success alert',
	},
	{
		type: 'info',
		message: 'This is an info alert',
	},
	{
		type: 'warning',
		message: 'This is a warning alert',
	},
	{
		type: 'danger',
		message: 'This is a danger alert',
	},
	{
		type: 'primary',
		message: 'This is a primary alert',
	},
	{
		type: 'secondary',
		message: 'This is a secondary alert',
	},
	{
		type: 'light',
		message: 'This is a light alert',
	},
	{
		type: 'dark',
		message: 'This is a dark alert',
	},
];

@Component({
	selector: 'ngbd-alert-closeable',
	imports: [NgbAlert],
	templateUrl: './alert-closeable.html',
})
export class NgbdAlertCloseable {
	readonly alerts = signal<Alert[]>(ALERTS);

	close(alert: Alert) {
		this.alerts.update((alerts) => alerts.filter((a) => a !== alert));
	}

	reset() {
		this.alerts.set(Array.from(ALERTS));
	}
}
