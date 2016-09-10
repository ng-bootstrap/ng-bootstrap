import {NgbAlertConfig} from './alert-config';

describe('ngb-alert-config', () => {
  it('should have sensible default values', () => {
    const config = new NgbAlertConfig();

    expect(config.dismissible).toBe(true);
    expect(config.type).toBe('warning');
  });
});
