import { Component, Input } from '@angular/core';

import { NgbTabContent, NgbTab, NgbTabset } from '../../../../../../src/tabset/tabset';

@Component({
  selector: 'ngbd-example-box',
  templateUrl: './example-box.component.html',
  directives: [NgbTab, NgbTabset, NgbTabContent]
})
export class ExampleBoxComponent {
  @Input() demoTitle: string;
  @Input() htmlSnippet: string;
  @Input() tsSnippet: string;
}
