import {NgbToastConfig} from './toast-config';

describe('NgbToastConfig', () => {
  it('should have sensible default values', () => {
    const config = new NgbToastConfig();

    expect(config.delay).toBe(500);
    expect(config.autohide).toBe(true);
    expect(config.ariaLive).toBe('polite');
  });
});
