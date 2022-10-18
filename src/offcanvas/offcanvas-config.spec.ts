import { inject } from '@angular/core/testing';

import { NgbConfig } from '../ngb-config';
import { NgbOffcanvasConfig } from './offcanvas-config';

describe('NgbOffcanvasConfig', () => {
	it('should have sensible default values', inject(
		[NgbOffcanvasConfig, NgbConfig],
		(config: NgbOffcanvasConfig, ngbConfig: NgbConfig) => {
			expect(config.animation).toBe(ngbConfig.animation);
			expect(config.ariaDescribedBy).toBeUndefined();
			expect(config.ariaLabelledBy).toBeUndefined();
			expect(config.backdrop).toBeTrue();
			expect(config.backdropClass).toBeUndefined();
			expect(config.beforeDismiss).toBeUndefined();
			expect(config.container).toBeUndefined();
			expect(config.injector).toBeUndefined();
			expect(config.keyboard).toBeTrue();
			expect(config.panelClass).toBeUndefined();
			expect(config.position).toBe('start');
			expect(config.scroll).toBeFalse();
		},
	));

	it('should compile when setting config backdrop to static', inject(
		[NgbOffcanvasConfig],
		(config: NgbOffcanvasConfig) => {
			config.backdrop = 'static';
			expect().nothing();
		},
	));
});
