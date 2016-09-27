import {RatingBasicComponent} from './basic/basic.component';
import {RatingConfigComponent} from './config/config.component';
import {RatingEventsComponent} from './events/events.component';

export const DEMO_DIRECTIVES = [RatingBasicComponent, RatingConfigComponent, RatingEventsComponent];

export const DEMO_SNIPPETS = {
  basic: {
    code: require('!!prismjs?lang=typescript!./basic/basic.component'),
    markup: require('!!prismjs?lang=markup!./basic/basic.component.html')
  },
  events: {
    code: require('!!prismjs?lang=typescript!./events/events.component'),
    markup: require('!!prismjs?lang=markup!./events/events.component.html')
  },
  config: {
    code: require('!!prismjs?lang=typescript!./config/config.component'),
    markup: require('!!prismjs?lang=markup!./config/config.component.html')
  }
};
