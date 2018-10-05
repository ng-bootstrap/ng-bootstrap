// tslint:disable:deprecation
import {NgbTabsetConfig} from './tabset-config';
import {NgbConfig} from '../ngb-config';

describe('ngb-tabset-config', () => {
  it('should have sensible default values', () => {
    const config = new NgbTabsetConfig(new NgbConfig());

    expect(config.type).toBe('tabs');
    expect(config.justify).toBe('start');
    expect(config.orientation).toBe('horizontal');
  });
});
