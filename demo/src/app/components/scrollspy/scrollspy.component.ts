import {Component} from '@angular/core';
import {ContentWrapper} from '../../shared';
import {ExampleBoxComponent, NgbdApiDocs} from '../shared';
import {DEMO_DIRECTIVES, DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-scrollspy',
  template: `
    <ngbd-content-wrapper component="NgbScrollspy">
      <ngbd-api-docs directive="NgbScrollSpy"></ngbd-api-docs>
      <ngbd-example-box demoTitle="Scrollspy" [htmlSnippet]="snippets.basic.markup" [tsSnippet]="snippets.basic.code">
        <ngbd-scrollspy-basic></ngbd-scrollspy-basic>      
      </ngbd-example-box>
    </ngbd-content-wrapper>
  `,
  directives: [ContentWrapper, NgbdApiDocs, DEMO_DIRECTIVES, ExampleBoxComponent]
})
export class NgbdScrollspy {
  snippets = DEMO_SNIPPETS;
}
