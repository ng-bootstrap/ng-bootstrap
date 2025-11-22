import { NgbCollapseConfig } from './collapse-config';
import { TestBed } from '@angular/core/testing';

describe('ngb-collapse-config', () => {
	it('should have sensible default values', () => {
		const config = TestBed.inject(NgbCollapseConfig);

		expect(config.horizontal).toBe(false);
	});
});
