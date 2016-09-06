import {NgbDropdownConfig} from './dropdown-config';

describe('ngb-dropdown-config', () => {
  it('should have sensible default values', () => {
    const config = new NgbDropdownConfig();

    expect(config.up).toBe(false);
    expect(config.autoClose).toBe(true);
  });
});
