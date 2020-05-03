import {NgbConfig} from './ngb-config';

describe('ngb-config', () => {
  it('should have animation disabled', () => {
    const config = new NgbConfig();

    expect(config.animation).toBe(false);
  });
});
