import {NgbAlertConfig, NgbSelfClosingAlertConfig} from './alert-config';

describe('ngb-alert-config', () => {
  it('should have sensible default values', () => {
    const config = new NgbAlertConfig();

    expect(config.dismissible).toBe(true);
    expect(config.type).toBe('warning');
  });
});

describe('ngb-self-closing-alert-config', () => {
  it('should have sensible default values', () => {
    const config = new NgbSelfClosingAlertConfig();

    expect(config.dismissible).toBe(false);
    expect(config.type).toBe('warning');
    expect(config.dismissOnTimeout).toBeUndefined();
  });
});
