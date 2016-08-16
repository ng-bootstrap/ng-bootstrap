import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngbd-example-box',
  templateUrl: './example-box.component.html'
})
export class ExampleBoxComponent {
  @Input() demoTitle: string;
  @Input() htmlSnippet: string;
  @Input() tsSnippet: string;
}
