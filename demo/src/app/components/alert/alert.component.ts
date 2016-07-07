import {Component} from '@angular/core';
import {ContentWrapper} from '../../shared';
import {ExampleBoxComponent, NgbdApiDocs} from '../shared';
import {DEMO_DIRECTIVES, DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-alert',
  template: `
    <ngbd-content-wrapper component="Alert">
      <ngbd-api-docs directive="NgbAlert"></ngbd-api-docs>
      <ngbd-api-docs directive="NgbDismissibleAlert"></ngbd-api-docs>
      <ngbd-example-box demoTitle="Basic Alert" [htmlSnippet]="snippets.basic.markup" [tsSnippet]="snippets.basic.code">
        <ngbd-alert-basic></ngbd-alert-basic>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Closeable Alert" [htmlSnippet]="snippets.closeable.markup" [tsSnippet]="snippets.closeable.code">
        <ngbd-alert-closeable></ngbd-alert-closeable>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Self-Closing Alert" [htmlSnippet]="snippets.selfClosing.markup" [tsSnippet]="snippets.selfClosing.code">
        <ngbd-alert-self-closing></ngbd-alert-self-closing>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Custom Alert" [htmlSnippet]="snippets.custom.markup" [tsSnippet]="snippets.custom.code">
        <ngbd-alert-custom></ngbd-alert-custom>
      </ngbd-example-box>
    </ngbd-content-wrapper>
  `,
  directives: [ContentWrapper, NgbdApiDocs, DEMO_DIRECTIVES, ExampleBoxComponent]
})
export class NgbdAlert {
   snippets = DEMO_SNIPPETS;
}
