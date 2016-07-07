import {Component} from '@angular/core';
import {ContentWrapper} from '../../shared';
import {ExampleBoxComponent, NgbdApiDocs} from '../shared';
import {DEMO_DIRECTIVES, DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-tabs',
  template: `
    <ngbd-content-wrapper component="Tabs">
      <ngbd-api-docs directive="NgbTabset"></ngbd-api-docs>
      <ngbd-api-docs directive="NgbTab"></ngbd-api-docs>
      <ngbd-api-docs directive="NgbTabTitle"></ngbd-api-docs>
      <ngbd-api-docs directive="NgbTabContent"></ngbd-api-docs>
      <ngbd-example-box demoTitle="Tabset" [htmlSnippet]="snippets.basic.markup" [tsSnippet]="snippets.basic.code">
        <ngbd-tabset-basic></ngbd-tabset-basic>      
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Pills" [htmlSnippet]="snippets.pills.markup" [tsSnippet]="snippets.pills.code">
        <ngbd-tabset-pills></ngbd-tabset-pills>      
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Select an active tab by id" [htmlSnippet]="snippets.selectById.markup"
          [tsSnippet]="snippets.selectById.code">
        <ngbd-tabset-selectById></ngbd-tabset-selectById>      
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Prevent tab change" [htmlSnippet]="snippets.preventChange.markup"
          [tsSnippet]="snippets.preventChange.code">
        <ngbd-tabset-preventChange></ngbd-tabset-preventChange>      
      </ngbd-example-box>
    </ngbd-content-wrapper>
  `,
  directives: [ContentWrapper, NgbdApiDocs, DEMO_DIRECTIVES, ExampleBoxComponent]
})
export class NgbdTabs {
  snippets = DEMO_SNIPPETS;
}
