import {NgbNavConfig} from './nav-config';
import {NgbConfig} from '../ngb-config';

describe('ngb-nav-config', () => {
  it('should have sensible default values', () => {
    const config = new NgbNavConfig(new NgbConfig());

    expect(config.destroyOnHide).toBe(true);
    expect(config.orientation).toBe('horizontal');
    expect(config.roles).toBe('tablist');
    expect(config.keyboard).toBe(false);
  });
});
