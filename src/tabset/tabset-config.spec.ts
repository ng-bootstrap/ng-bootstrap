import {NgbTabsetConfig} from './tabset-config';

describe('ngb-tabset-config', () => {
  it('should have sensible default values', () => {
    const config = new NgbTabsetConfig();

    expect(config.type).toBe('tabs');
  });
});
