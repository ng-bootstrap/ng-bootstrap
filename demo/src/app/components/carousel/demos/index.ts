import {NgbdCarouselBasic} from './basic/carousel-basic';
import {NgbdCarouselConfig} from './config/carousel-config';
import {NgbdCarouselNavigation} from './navigation/carousel-navigation';

export const DEMO_DIRECTIVES = [NgbdCarouselBasic, NgbdCarouselConfig, NgbdCarouselNavigation];

export const DEMO_SNIPPETS = {
  'basic': {
    'code': require('!!raw-loader!./basic/carousel-basic'),
    'markup': require('!!raw-loader!./basic/carousel-basic.html')
  },
  'config': {
    'code': require('!!raw-loader!./config/carousel-config'),
    'markup': require('!!raw-loader!./config/carousel-config.html')
  },
  'navigation': {
    'code': require('!!raw-loader!./navigation/carousel-navigation'),
    'markup': require('!!raw-loader!./navigation/carousel-navigation.html')
  }
};
