import {Component} from '@angular/core';

import {DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-modal',
  template: `
    <template ngbModalContainer></template>
    <ngbd-content-wrapper component="Modal">
      <ngbd-example-box demoTitle="Components as content" [snippets]="snippets" component="modal" demo="component">
          <ngbd-modal-component></ngbd-modal-component>
      </ngbd-example-box>      
    </ngbd-content-wrapper>
  `
})
export class NgbdModal {
  snippets = DEMO_SNIPPETS;
}
