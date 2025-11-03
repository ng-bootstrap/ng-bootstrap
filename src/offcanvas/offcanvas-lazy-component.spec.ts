import { Component, inject, Injectable, Injector, OnDestroy } from '@angular/core';
import { NgbOffcanvas } from './offcanvas';

@Injectable()
class LazyService {
	get text() {
		return 'lazy offcanvas';
	}
}

@Component({
	template: '{{ lazyService.text }}',
})
class LazyOffCanvasContent {
	readonly lazyService = inject(LazyService);
}

@Component({
	template: 'child',
	providers: [LazyService],
})
export default class LazyComponent implements OnDestroy {
	private readonly injector = inject(Injector);
	private readonly _ref = inject(NgbOffcanvas).open(LazyOffCanvasContent, { injector: this.injector });

	ngOnDestroy() {
		this._ref.close();
	}
}
