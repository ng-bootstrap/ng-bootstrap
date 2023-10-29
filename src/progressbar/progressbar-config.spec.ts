import { NgbProgressbarConfig } from './progressbar-config';
import { TestBed } from '@angular/core/testing';

describe('ngb-progressbar-config', () => {
	it('should have sensible default values', () => {
		const config = TestBed.inject(NgbProgressbarConfig);

		expect(config.ariaLabel).toBe('progress bar');
		expect(config.max).toBe(100);
		expect(config.striped).toBe(false);
		expect(config.animated).toBe(false);
		expect(config.textType).toBeUndefined();
		expect(config.type).toBeUndefined();
		expect(config.showValue).toBe(false);
		expect(config.height).toBeUndefined();
	});
});
