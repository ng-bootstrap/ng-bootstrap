import {Component} from '@angular/core';
import {DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-alert',
  template: `
    <ngbd-content-wrapper component="Alert">
      <ngbd-api-docs directive="NgbAlert"></ngbd-api-docs>
      <ngbd-api-docs-config type="NgbAlertConfig"></ngbd-api-docs-config>
      <ngbd-example-box demoTitle="Basic Alert" [htmlSnippet]="snippets.basic.markup" [tsSnippet]="snippets.basic.code">
        <ngbd-alert-basic></ngbd-alert-basic>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Closeable Alert" [htmlSnippet]="snippets.closeable.markup" [tsSnippet]="snippets.closeable.code">
        <ngbd-alert-closeable></ngbd-alert-closeable>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Self-Closing Alert" [htmlSnippet]="snippets.selfClosing.markup" [tsSnippet]="snippets.selfClosing.code">
        <ngbd-alert-selfclosing></ngbd-alert-selfclosing>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Custom Alert" [htmlSnippet]="snippets.custom.markup" [tsSnippet]="snippets.custom.code">
        <ngbd-alert-custom></ngbd-alert-custom>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Global configuration of alerts" 
                        [htmlSnippet]="snippets.config.markup" 
                        [tsSnippet]="snippets.config.code">
        <ngbd-alert-config></ngbd-alert-config>
      </ngbd-example-box>
    </ngbd-content-wrapper>
  `
})
export class NgbdAlert {
   snippets = DEMO_SNIPPETS;
}
