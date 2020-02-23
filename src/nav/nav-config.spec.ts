import {NgbNavConfig} from './nav-config';

describe('ngb-nav-config', () => {
  it('should have sensible default values', () => {
    const config = new NgbNavConfig();

    expect(config.destroyOnHide).toBe(true);
    expect(config.orientation).toBe('horizontal');
    expect(config.roles).toBe('tablist');
  });
});
