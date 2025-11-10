import { NgbToastConfig } from './toast-config';
import { TestBed } from '@angular/core/testing';

describe('NgbToastConfig', () => {
	it('should have sensible default values', () => {
		const config = TestBed.inject(NgbToastConfig);

		expect(config.delay).toBe(5000);
		expect(config.autohide).toBe(true);
		expect(config.ariaLive).toBe('polite');
	});
});
