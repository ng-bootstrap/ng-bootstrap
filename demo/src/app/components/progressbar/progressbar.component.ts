import {Component} from '@angular/core';
import {DEMO_SNIPPETS} from './demos';

@Component({
  selector: 'ngbd-progressbar',
  template: `
    <ngbd-component-wrapper component="Progressbar">
      <ngbd-api-docs directive="NgbProgressbar"></ngbd-api-docs>
      <ngbd-api-docs-config type="NgbProgressbarConfig"></ngbd-api-docs-config>
      <ngbd-example-box demoTitle="Contextual progress bars" [snippets]="snippets" component="progressbar" demo="basic">
        <ngbd-progressbar-basic></ngbd-progressbar-basic>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Progress bars with current value labels" [snippets]="snippets" component="progressbar" demo="showvalue">
        <ngbd-progressbar-showvalue></ngbd-progressbar-showvalue>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Striped progress bars" [snippets]="snippets" component="progressbar" demo="striped">
        <ngbd-progressbar-striped></ngbd-progressbar-striped>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Progress bars with custom labels" [snippets]="snippets" component="progressbar" demo="labels">
        <ngbd-progressbar-labels></ngbd-progressbar-labels>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Progress bars with height" [snippets]="snippets" component="progressbar" demo="height">
        <ngbd-progressbar-height></ngbd-progressbar-height>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Global configuration of progress bars" [snippets]="snippets" component="progressbar" demo="config">
        <ngbd-progressbar-config></ngbd-progressbar-config>
      </ngbd-example-box>
    </ngbd-component-wrapper>
  `
})
export class NgbdProgressbar {
  snippets = DEMO_SNIPPETS;
}
