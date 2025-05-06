import { Injectable, signal, TemplateRef } from '@angular/core';

export interface Toast {
	template: TemplateRef<any>;
	classname?: string;
	delay?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
	private readonly _toasts = signal<Toast[]>([]);
	readonly toasts = this._toasts.asReadonly();

	show(toast: Toast) {
		this._toasts.update((toasts) => [...toasts, toast]);
	}

	remove(toast: Toast) {
		this._toasts.update((toasts) => toasts.filter((t) => t !== toast));
	}

	clear() {
		this._toasts.set([]);
	}
}
