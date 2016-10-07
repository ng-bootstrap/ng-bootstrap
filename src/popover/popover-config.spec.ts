import {NgbPopoverConfig} from './popover-config';

describe('ngb-popover-config', () => {
  it('should have sensible default values', () => {
    const config = new NgbPopoverConfig();

    expect(config.placement).toBe('top');
    expect(config.triggers).toBe('click');
    expect(config.container).toBeUndefined();
  });
});
