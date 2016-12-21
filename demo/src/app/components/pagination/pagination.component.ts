import {Component} from '@angular/core';
import {DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-pagination',
  template: `
    <ngbd-content-wrapper component="Pagination">
      <ngbd-api-docs directive="NgbPagination"></ngbd-api-docs>
      <ngbd-api-docs-config type="NgbPaginationConfig"></ngbd-api-docs-config>
      <ngbd-example-box demoTitle="Basic pagination" [snippets]="snippets" component="pagination" demo="basic">
        <ngbd-pagination-basic></ngbd-pagination-basic>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Advanced pagination" [snippets]="snippets" component="pagination" demo="advanced">
        <ngbd-pagination-advanced></ngbd-pagination-advanced>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Pagination size" [snippets]="snippets" component="pagination" demo="size">
        <ngbd-pagination-size></ngbd-pagination-size>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Disabled pagination" [snippets]="snippets" component="pagination" demo="disabled">
        <ngbd-pagination-disabled></ngbd-pagination-disabled>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Global configuration" [snippets]="snippets" component="pagination" demo="config">
        <ngbd-pagination-config></ngbd-pagination-config>
      </ngbd-example-box>
    </ngbd-content-wrapper>
  `
})
export class NgbdPagination {
  snippets = DEMO_SNIPPETS;
}
