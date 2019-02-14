import {NgbTooltipConfig} from './tooltip-config';

describe('ngb-tooltip-config', () => {
  it('should have sensible default values', () => {
    const config = new NgbTooltipConfig();

    expect(config.autoClose).toBe(true);
    expect(config.placement).toBe('auto');
    expect(config.triggers).toBe('hover focus');
    expect(config.container).toBeUndefined();
    expect(config.disableTooltip).toBe(false);
    expect(config.tooltipClass).toBeUndefined();
  });
});
