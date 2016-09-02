import {Component} from '@angular/core';
import {DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-pagination',
  template: `
    <ngbd-content-wrapper component="Pagination">
      <ngbd-api-docs directive="NgbPagination"></ngbd-api-docs>
      <ngbd-api-docs-config type="NgbPaginationConfig"></ngbd-api-docs-config>
      <ngbd-example-box demoTitle="Basic pagination" [htmlSnippet]="snippets.basic.markup" [tsSnippet]="snippets.basic.code">
        <ngbd-pagination-basic></ngbd-pagination-basic>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Advanced pagination" [htmlSnippet]="snippets.advanced.markup" [tsSnippet]="snippets.advanced.code">
        <ngbd-pagination-advanced></ngbd-pagination-advanced>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Pagination size" [htmlSnippet]="snippets.size.markup" [tsSnippet]="snippets.size.code">
        <ngbd-pagination-size></ngbd-pagination-size>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Global configuration of paginations" 
                        [htmlSnippet]="snippets.config.markup" 
                        [tsSnippet]="snippets.config.code">
        <ngbd-pagination-config></ngbd-pagination-config>
      </ngbd-example-box>
    </ngbd-content-wrapper>
  `
})
export class NgbdPagination {
  snippets = DEMO_SNIPPETS;
}
