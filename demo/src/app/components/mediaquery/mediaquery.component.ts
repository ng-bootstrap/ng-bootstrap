import {Component} from '@angular/core';
import {DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-mediaquery',
  template: `
    <ngbd-content-wrapper component="Media Query">
      <ngbd-api-docs-class type="NgbMediaQuery"></ngbd-api-docs-class>
      <ngbd-example-box demoTitle="Basic MediaQuery" [snippets]="snippets" component="mediaquery" demo="basic">
        <ngbd-mediaquery-basic></ngbd-mediaquery-basic>
      </ngbd-example-box>
    </ngbd-content-wrapper>
  `
})
export class NgbdMediaQuery {
   snippets = DEMO_SNIPPETS;
}
