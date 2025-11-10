import { NgbNavConfig } from './nav-config';
import { TestBed } from '@angular/core/testing';
import { NgbConfig } from '@ng-bootstrap/ng-bootstrap/config';

describe('ngb-nav-config', () => {
	it('should have sensible default values', () => {
		const ngbConfig = TestBed.inject(NgbConfig);
		const config = TestBed.inject(NgbNavConfig);

		expect(config.animation).toBe(ngbConfig.animation);
		expect(config.destroyOnHide).toBe(true);
		expect(config.orientation).toBe('horizontal');
		expect(config.roles).toBe('tablist');
		expect(config.keyboard).toBe(true);
	});
});
