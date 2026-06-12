import { Component, inject, Injectable, Injector, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { NgbOffcanvas } from '../offcanvas/offcanvas';

@Injectable()
class LazyService {
	get text() {
		return 'lazy offcanvas';
	}
}

@Component({
	changeDetection: ChangeDetectionStrategy.Eager,
	template: '{{ lazyService.text }}',
})
class LazyOffCanvasContent {
	readonly lazyService = inject(LazyService);
}

@Component({
	template: 'child',
	changeDetection: ChangeDetectionStrategy.Eager,
	providers: [LazyService],
})
export default class LazyComponent implements OnDestroy {
	private readonly injector = inject(Injector);
	private readonly _ref = inject(NgbOffcanvas).open(LazyOffCanvasContent, { injector: this.injector });

	ngOnDestroy() {
		this._ref.close();
	}
}
