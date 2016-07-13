import {Component} from '@angular/core';
import {ContentWrapper} from '../../shared';
import {ExampleBoxComponent, NgbdApiDocs} from '../shared';
import {DEMO_DIRECTIVES, DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-pagination',
  template: `
    <ngbd-content-wrapper component="Pagination">
      <ngbd-api-docs directive="NgbPagination"></ngbd-api-docs>
      <ngbd-example-box demoTitle="Basic pagination" [htmlSnippet]="snippets.basic.markup" [tsSnippet]="snippets.basic.code">
        <ngbd-pagination-basic></ngbd-pagination-basic>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Advanced pagination" [htmlSnippet]="snippets.advanced.markup" [tsSnippet]="snippets.advanced.code">
        <ngbd-pagination-advanced></ngbd-pagination-advanced>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Pagination size" [htmlSnippet]="snippets.size.markup" [tsSnippet]="snippets.size.code">
        <ngbd-pagination-size></ngbd-pagination-size>
      </ngbd-example-box>
    </ngbd-content-wrapper>
  `,
  directives: [ContentWrapper, NgbdApiDocs, DEMO_DIRECTIVES, ExampleBoxComponent]
})
export class NgbdPagination {
  snippets = DEMO_SNIPPETS;
}
