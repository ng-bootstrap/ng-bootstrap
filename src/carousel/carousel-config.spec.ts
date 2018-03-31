import {NgbCarouselConfig} from './carousel-config';

describe('ngb-carousel-config', () => {
  it('should have sensible default values', () => {
    const config = new NgbCarouselConfig();

    expect(config.interval).toBe(5000);
    expect(config.keyboard).toBe(true);
    expect(config.wrap).toBe(true);
    expect(config.pauseOnHover).toBe(true);
    expect(config.showNavigationIndicators).toBe(true);
    expect(config.showNavigationArrows).toBe(true);
  });
});
