import {NgbPaginationConfig} from './pagination-config';

describe('ngb-pagination-config', () => {
  it('should have sensible default values', () => {
    const config = new NgbPaginationConfig();

    expect(config.boundaryLinks).toBe(false);
    expect(config.directionLinks).toBe(true);
    expect(config.ellipses).toBe(true);
    expect(config.maxSize).toBe(0);
    expect(config.pageSize).toBe(10);
    expect(config.rotate).toBe(false);
    expect(config.size).toBeUndefined();
  });
});
