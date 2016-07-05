import {Component} from '@angular/core';
import {ContentWrapper} from '../../shared';
import {ExampleBoxComponent, NgbdApiDocs} from '../shared';
import {DEMO_DIRECTIVES, DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-pager',
  template: `
    <ngbd-content-wrapper component="Pager">
      <ngbd-api-docs directive="NgbPager"></ngbd-api-docs>
      <ngbd-example-box demoTitle="Pager" [htmlSnippet]="snippets.basic.markup" [tsSnippet]="snippets.basic.code">
        <ngbd-pager-basic></ngbd-pager-basic>      
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Pager with aligned links" [htmlSnippet]="snippets.align.markup" [tsSnippet]="snippets.align.code">
        <ngbd-pager-align></ngbd-pager-align>      
      </ngbd-example-box>
    </ngbd-content-wrapper>
  `,
  directives: [ContentWrapper, NgbdApiDocs, DEMO_DIRECTIVES, ExampleBoxComponent]
})
export class NgbdPager {
  snippets = DEMO_SNIPPETS;
}
