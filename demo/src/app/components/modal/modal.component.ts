import {Component} from '@angular/core';

import {DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-modal',
  template: `
    <ngbd-component-wrapper component="Modal">
      <ngbd-api-docs-class type="NgbModal"></ngbd-api-docs-class>
      <ngbd-api-docs-class type="NgbModalOptions"></ngbd-api-docs-class>
      <ngbd-api-docs-class type="NgbModalRef"></ngbd-api-docs-class>
      <ngbd-api-docs-class type="NgbActiveModal"></ngbd-api-docs-class>
      <ngbd-example-box demoTitle="Modal with default options" [snippets]="snippets" component="modal" demo="basic">
          <ngbd-modal-basic></ngbd-modal-basic>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Components as content" [snippets]="snippets" component="modal" demo="component">
          <ngbd-modal-component></ngbd-modal-component>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Modal with custom class" [snippets]="snippets" component="modal" demo="customclass">
          <ngbd-modal-customclass></ngbd-modal-customclass>
      </ngbd-example-box>
    </ngbd-component-wrapper>
  `
})
export class NgbdModal {
  snippets = DEMO_SNIPPETS;
}
