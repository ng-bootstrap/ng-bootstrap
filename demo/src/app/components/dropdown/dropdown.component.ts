import {Component} from '@angular/core';
import {DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-dropdown',
  template: `
    <ngbd-content-wrapper component="Dropdown">
      <ngbd-api-docs directive="NgbDropdown"></ngbd-api-docs>
      <ngbd-api-docs directive="NgbDropdownToggle"></ngbd-api-docs>
      <ngbd-api-docs-config type="NgbDropdownConfig"></ngbd-api-docs-config>
      <ngbd-example-box demoTitle="Dropdown" [htmlSnippet]="snippets.basic.markup" [tsSnippet]="snippets.basic.code">
        <ngbd-dropdown-basic></ngbd-dropdown-basic>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Manual triggers" [htmlSnippet]="snippets.manual.markup" [tsSnippet]="snippets.manual.code">
        <ngbd-dropdown-manual></ngbd-dropdown-manual>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Global configuration of dropdowns" 
                        [htmlSnippet]="snippets.config.markup" 
                        [tsSnippet]="snippets.config.code">
        <ngbd-dropdown-config></ngbd-dropdown-config>
      </ngbd-example-box>
    </ngbd-content-wrapper>
  `
})
export class NgbdDropdown {
  snippets = DEMO_SNIPPETS;
}
