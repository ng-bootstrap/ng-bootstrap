import {Component} from '@angular/core';
import {DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-typeahead',
  template: `
    <ngbd-content-wrapper component="Typeahead">
      <ngbd-api-docs directive="NgbTypeahead"></ngbd-api-docs>
      <ngbd-api-docs-class type="ResultTemplateContext"></ngbd-api-docs-class>
      <ngbd-example-box demoTitle="Simple Typeahead" [htmlSnippet]="snippets.basic.markup" [tsSnippet]="snippets.basic.code">
        <ngbd-typeahead-basic></ngbd-typeahead-basic>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Formatted results" [htmlSnippet]="snippets.format.markup" [tsSnippet]="snippets.format.code">
        <ngbd-typeahead-format></ngbd-typeahead-format>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Wikipedia search" [htmlSnippet]="snippets.http.markup" [tsSnippet]="snippets.http.code">
        <ngbd-typeahead-http></ngbd-typeahead-http>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Template for results" [htmlSnippet]="snippets.template.markup" [tsSnippet]="snippets.template.code">
        <ngbd-typeahead-template></ngbd-typeahead-template>
      </ngbd-example-box>
    </ngbd-content-wrapper>
  `
})
export class NgbdTypeahead {
  snippets = DEMO_SNIPPETS;
}
