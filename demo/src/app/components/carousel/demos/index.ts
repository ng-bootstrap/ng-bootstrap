import {NgbdCarouselBasic} from './basic/carousel-basic';
import {NgbdCarouselConfig} from './config/carousel-config';

export const DEMO_DIRECTIVES = [NgbdCarouselBasic, NgbdCarouselConfig];

export const DEMO_SNIPPETS = {
  'basic': {
    'code': require('!!raw-loader!./basic/carousel-basic'),
    'markup': require('!!raw-loader!./basic/carousel-basic.html')
  },
  'config': {
    'code': require('!!raw-loader!./config/carousel-config'),
    'markup': require('!!raw-loader!./config/carousel-config.html')
  }
};
