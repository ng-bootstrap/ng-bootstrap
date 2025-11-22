import { NgbCarouselConfig } from './carousel-config';
import { TestBed } from '@angular/core/testing';

describe('ngb-carousel-config', () => {
	it('should have sensible default values', () => {
		const config = TestBed.inject(NgbCarouselConfig);

		expect(config.interval).toBe(5000);
		expect(config.keyboard).toBe(true);
		expect(config.wrap).toBe(true);
		expect(config.pauseOnHover).toBe(true);
		expect(config.showNavigationIndicators).toBe(true);
		expect(config.showNavigationArrows).toBe(true);
	});
});
