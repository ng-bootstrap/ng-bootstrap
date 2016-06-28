import {Component} from '@angular/core';
import {ExampleBoxComponent, NgbdApiDocs} from '../shared';
import {AlertBasicComponent, basicHtmlContent, basicTsContent,
        AlertCloseableComponent, closeableHtmlContent, closeableTsContent,
        AlertCustomComponent, customHtmlContent, customTsContent} from './demos';

@Component({
  selector: 'ngbd-alert',
  template: `
    <ngbd-api-docs directive="NgbAlert"></ngbd-api-docs>        
    <ngbd-example-box demoTitle="Basic Alert" [htmlSnippet]="basicHtmlContent" [tsSnippet]="basicTsContent">
      <ngbd-alert-basic></ngbd-alert-basic>
    </ngbd-example-box>
    <ngbd-example-box demoTitle="Closeable Alert" [htmlSnippet]="closeableHtmlContent" [tsSnippet]="closeableTsContent">
      <ngbd-alert-closeable></ngbd-alert-closeable>
    </ngbd-example-box>
    <ngbd-example-box demoTitle="Custom Alert" [htmlSnippet]="customHtmlContent" [tsSnippet]="customTsContent">
      <ngbd-alert-custom></ngbd-alert-custom>
    </ngbd-example-box>
  `,
  directives: [AlertBasicComponent, AlertCloseableComponent, AlertCustomComponent, NgbdApiDocs, ExampleBoxComponent]
})
export class NgbdAlert {
  basicHtmlContent = basicHtmlContent;
  basicTsContent = basicTsContent;
  closeableHtmlContent = closeableHtmlContent;
  closeableTsContent = closeableTsContent;
  customHtmlContent = customHtmlContent;
  customTsContent = customTsContent;
}
