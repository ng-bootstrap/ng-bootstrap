import {Component} from 'angular2/core';
import {bootstrap} from 'angular2/platform/browser';

@Component({
  selector: 'demo-app',
  template: `
    <div>Hello World</div>
  `
})
class Demo {
}

bootstrap(Demo);
