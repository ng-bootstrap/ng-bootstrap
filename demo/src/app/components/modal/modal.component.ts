import {Component} from '@angular/core';

import {DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-modal',
  template: `
    <template ngbModalContainer></template>
    <ngbd-content-wrapper component="Modal">
      <ngbd-api-docs-class type="NgbModal"></ngbd-api-docs-class>
      <ngbd-api-docs-class type="NgbModalOptions"></ngbd-api-docs-class>
      <ngbd-api-docs-class type="NgbModalRef"></ngbd-api-docs-class>
      <ngbd-api-docs-class type="NgbActiveModal"></ngbd-api-docs-class>
      <ngb-alert [dismissible]="false">
        <strong>Heads up!</strong>
        The <code>NgbModal</code> service needs a container element with the <code>ngbModalContainer</code> directive. The
        <code>ngbModalContainer</code> directive marks the place in the DOM where modals are opened. Be sure to add 
        <code>&lt;template ngbModalContainer&gt;&lt;/template&gt;</code> somewhere under your application root element.
      </ngb-alert>      
      <ngbd-example-box demoTitle="Modal with default options" [snippets]="snippets" component="modal" demo="basic">
          <ngbd-modal-basic></ngbd-modal-basic>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Components as content" [snippets]="snippets" component="modal" demo="component">
          <ngbd-modal-component></ngbd-modal-component>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Modal with custom class" [snippets]="snippets" component="modal" demo="customclass">
          <ngbd-modal-customclass></ngbd-modal-customclass>
      </ngbd-example-box>
    </ngbd-content-wrapper>
  `
})
export class NgbdModal {
  snippets = DEMO_SNIPPETS;
}
