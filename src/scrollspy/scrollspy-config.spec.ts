import { NgbScrollSpyConfig } from './scrollspy-config';
import { defaultProcessChanges } from './scrollspy.utils';
import { describe, expect, it } from 'vitest';

describe('scrollspy-config', () => {
	it('should have sensible default values', () => {
		let config = new NgbScrollSpyConfig();
		expect(config.scrollBehavior).toBe('smooth');
		expect(config.processChanges).toBe(defaultProcessChanges);
	});
});
