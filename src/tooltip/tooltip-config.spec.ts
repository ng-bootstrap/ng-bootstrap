import {NgbTooltipConfig} from './tooltip-config';

describe('ngb-tooltip-config', () => {
  it('should have sensible default values', () => {
    const config = new NgbTooltipConfig();

    expect(config.placement).toBe('top');
    expect(config.triggers).toBe('hover');
    expect(config.container).toBeUndefined();
    expect(config.disableTooltip).toBe(false);
  });
});
