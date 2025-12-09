import {
	NgbAccordionConfig,
	NgbAlertConfig,
	NgbCarouselConfig,
	NgbCollapseConfig,
	NgbConfig,
	NgbModalConfig,
	NgbNavConfig,
	NgbPopoverConfig,
	NgbToastConfig,
	NgbTooltipConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

describe('ngb-config', () => {
	it('should have animation disabled', () => {
		const config = TestBed.inject(NgbConfig);

		expect(config.animation).toBe(false);
	});
});

describe('ngb-config animation override', () => {
	it(`should use delegation to 'ngbConfig' regardless of injection order`, () => {
		const ngbConfig = TestBed.inject(NgbConfig);
		ngbConfig.animation = true;

		const accordionConfig = TestBed.inject(NgbAccordionConfig);
		const alertConfig = TestBed.inject(NgbAlertConfig);
		const carouselConfig = TestBed.inject(NgbCarouselConfig);
		const collapseConfig = TestBed.inject(NgbCollapseConfig);
		const modalConfig = TestBed.inject(NgbModalConfig);
		const navConfig = TestBed.inject(NgbNavConfig);
		const popoverConfig = TestBed.inject(NgbPopoverConfig);
		const toastConfig = TestBed.inject(NgbToastConfig);
		const tooltipConfig = TestBed.inject(NgbTooltipConfig);
		expect(accordionConfig.animation, 'accordion').toBe(true);
		expect(alertConfig.animation, 'alert').toBe(true);
		expect(carouselConfig.animation, 'carousel').toBe(true);
		expect(collapseConfig.animation, 'collapse').toBe(true);
		expect(modalConfig.animation, 'modal').toBe(true);
		expect(navConfig.animation, 'nav').toBe(true);
		expect(popoverConfig.animation, 'popover').toBe(true);
		expect(toastConfig.animation, 'toast').toBe(true);
		expect(tooltipConfig.animation, 'tooltip').toBe(true);
	});
});
