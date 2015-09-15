import 'reflect-metadata'
import 'es6-shim'

import {Component, View, bootstrap} from 'angular2/angular2'
import {UIBSAccordion} from 'ui-bootstrap-core/components/accordion'

@Component({
  selector: 'ui-bs-demo'
})
@View({
  template: `
    <div>
      <h3>ui-bs-demos</h3>
      
      Accordion
      <ui-bs-accordion>
      </ui-bs-accordion>
    <div>
  `,
  directives: [UIBSAccordion]
})
class DemoApp {
  constructor() {
    
  }
}

bootstrap(DemoApp)
  .catch(err => console.log(err));