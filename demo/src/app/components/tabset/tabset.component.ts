import {Component} from '@angular/core';
import {DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-tabs',
  template: `
    <ngbd-component-wrapper component="Tabs">
      <ngbd-api-docs directive="NgbTabset"></ngbd-api-docs>
      <ngbd-api-docs directive="NgbTab"></ngbd-api-docs>
      <ngbd-api-docs directive="NgbTabTitle"></ngbd-api-docs>
      <ngbd-api-docs directive="NgbTabContent"></ngbd-api-docs>
      <ngbd-api-docs-class type="NgbTabChangeEvent"></ngbd-api-docs-class>
      <ngbd-api-docs-config type="NgbTabsetConfig"></ngbd-api-docs-config>
      <ngbd-example-box demoTitle="Tabset" [snippets]="snippets" component="tabset" demo="basic">
        <ngbd-tabset-basic></ngbd-tabset-basic>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Pills" [snippets]="snippets" component="tabset" demo="pills">
        <ngbd-tabset-pills></ngbd-tabset-pills>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Select an active tab by id" [snippets]="snippets" component="tabset" demo="selectbyid">
        <ngbd-tabset-selectbyid></ngbd-tabset-selectbyid>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Prevent tab change" [snippets]="snippets" component="tabset" demo="preventchange">
        <ngbd-tabset-preventchange></ngbd-tabset-preventchange>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Global configuration of tabs" [snippets]="snippets" component="tabset" demo="config">
        <ngbd-tabset-config></ngbd-tabset-config>
      </ngbd-example-box>
    </ngbd-component-wrapper>
  `
})
export class NgbdTabs {
  snippets = DEMO_SNIPPETS;
}
