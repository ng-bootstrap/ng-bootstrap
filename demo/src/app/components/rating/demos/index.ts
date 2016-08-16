import {RatingBasicComponent} from './basic/basic.component';

export const DEMO_DIRECTIVES = [RatingBasicComponent];

export const DEMO_SNIPPETS = {
  basic: {
    code: require('!!prismjs?lang=typescript!./basic/basic.component'),
    markup: require('!!prismjs?lang=markup!./basic/basic.component.html')
  }
};
