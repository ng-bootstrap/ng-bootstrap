import { inject } from '@angular/core/testing';

import { NgbColorModeService } from './color-mode.service';

describe('ColorModeService', () => {
	let service: NgbColorModeService;

	beforeEach(inject([NgbColorModeService], (s: NgbColorModeService) => {
		service = s;
	}));

	it('should get colorMode value', () => {
		spyOn(localStorage, 'getItem').and.returnValue(null);

		service.initialize();

		const colorMode = service.currentColorMode;
		expect(colorMode()).toBe('auto');

		service.setColorMode('dark');
		expect(colorMode()).toBe('dark');

		service.setColorMode('light');
		expect(colorMode()).toBe('light');
	});
});
