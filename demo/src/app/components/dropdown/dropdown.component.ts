import {Component} from '@angular/core';
import {DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-dropdown',
  template: `
    <ngbd-component-wrapper component="Dropdown">
      <ngbd-api-docs directive="NgbDropdown"></ngbd-api-docs>
      <ngbd-api-docs directive="NgbDropdownToggle"></ngbd-api-docs>
      <ngbd-api-docs directive="NgbDropdownAnchor"></ngbd-api-docs>
      <ngbd-api-docs-config type="NgbDropdownConfig"></ngbd-api-docs-config>
      <ngbd-example-box demoTitle="Dropdown" [snippets]="snippets" component="dropdown" demo="basic">
        <ngbd-dropdown-basic></ngbd-dropdown-basic>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Manual and custom triggers" [snippets]="snippets" component="dropdown" demo="manual">
        <ngbd-dropdown-manual></ngbd-dropdown-manual>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Button groups and split buttons" [snippets]="snippets" component="dropdown" demo="split">
        <ngbd-dropdown-split></ngbd-dropdown-split>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Global configuration of dropdowns" [snippets]="snippets" component="dropdown" demo="config">
        <ngbd-dropdown-config></ngbd-dropdown-config>
      </ngbd-example-box>
    </ngbd-component-wrapper>
  `
})
export class NgbdDropdown {
  snippets = DEMO_SNIPPETS;
}
