import {NgbDatepickerConfig} from './datepicker-config';
import {TranslationWidth} from '@angular/common';

describe('ngb-datepicker-config', () => {
  it('should have sensible default values', () => {
    const config = new NgbDatepickerConfig();

    expect(config.dayTemplate).toBeUndefined();
    expect(config.displayMonths).toBe(1);
    expect(config.firstDayOfWeek).toBe(1);
    expect(config.markDisabled).toBeUndefined();
    expect(config.minDate).toBeUndefined();
    expect(config.maxDate).toBeUndefined();
    expect(config.navigation).toBe('select');
    expect(config.outsideDays).toBe('visible');
    expect(config.weekdays).toBe(TranslationWidth.Short);
    expect(config.showWeekNumbers).toBe(false);
    expect(config.startDate).toBeUndefined();
  });
});
