import {NgbPopoverConfig} from './popover-config';

describe('ngb-popover-config', () => {
  it('should have sensible default values', () => {
    const config = new NgbPopoverConfig();

    expect(config.autoClose).toBe(true);
    expect(config.placement).toBe('top');
    expect(config.triggers).toBe('click');
    expect(config.container).toBeUndefined();
    expect(config.disablePopover).toBe(false);
    expect(config.popoverClass).toBeUndefined();
  });
});
