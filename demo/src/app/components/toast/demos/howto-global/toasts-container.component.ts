import { Component, inject } from '@angular/core';

import { ToastService } from './toast-service';
import { NgTemplateOutlet } from '@angular/common';
import { NgbToast } from '@ng-bootstrap/ng-bootstrap/toast';

@Component({
	selector: 'app-toasts',
	imports: [NgbToast, NgTemplateOutlet],
	template: `
		@for (toast of toastService.toasts(); track toast) {
			<ngb-toast
				[class]="toast.classname"
				[autohide]="true"
				[delay]="toast.delay || 5000"
				(hidden)="toastService.remove(toast)"
			>
				<ng-template [ngTemplateOutlet]="toast.template"></ng-template>
			</ngb-toast>
		}
	`,
	host: { class: 'toast-container position-fixed top-0 end-0 p-3', style: 'z-index: 1200' },
})
export class ToastsContainer {
	readonly toastService = inject(ToastService);
}
