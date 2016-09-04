import {NgbDatepickerConfig} from './datepicker-config';

describe('ngb-datepicker-config', () => {
  it('should have sensible default values', () => {
    const config = new NgbDatepickerConfig();

    expect(config.dayTemplate).toBeUndefined();
    expect(config.firstDayOfWeek).toBe(1);
    expect(config.markDisabled).toBeUndefined();
    expect(config.minDate).toBeUndefined();
    expect(config.maxDate).toBeUndefined();
    expect(config.showNavigation).toBe(true);
    expect(config.showWeekdays).toBe(true);
    expect(config.showWeekNumbers).toBe(false);
    expect(config.startDate).toBeUndefined();
  });
});
