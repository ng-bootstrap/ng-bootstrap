import {RatingBasicComponent} from './basic/basic.component';
import {RatingConfigComponent} from './config/config.component';

export const DEMO_DIRECTIVES = [RatingBasicComponent, RatingConfigComponent];

export const DEMO_SNIPPETS = {
  basic: {
    code: require('!!prismjs?lang=typescript!./basic/basic.component'),
    markup: require('!!prismjs?lang=markup!./basic/basic.component.html')
  },
  config: {
    code: require('!!prismjs?lang=typescript!./config/config.component'),
    markup: require('!!prismjs?lang=markup!./config/config.component.html')
  }
};
