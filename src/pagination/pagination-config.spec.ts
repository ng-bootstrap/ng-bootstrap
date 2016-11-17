import {NgbPaginationConfig} from './pagination-config';

describe('ngb-pagination-config', () => {
  it('should have sensible default values', () => {
    const config = new NgbPaginationConfig();

    expect(config.boundaryLinks).toBe(false);
    expect(config.directionLinks).toBe(true);
    expect(config.ellipses).toBe(true);
    expect(config.firstText).toBe('««');
    expect(config.lastText).toBe('»»');
    expect(config.maxSize).toBe(0);
    expect(config.nextText).toBe('»');
    expect(config.pageSize).toBe(10);
    expect(config.previousText).toBe('«');
    expect(config.rotate).toBe(false);
    expect(config.size).toBeUndefined();
  });
});
