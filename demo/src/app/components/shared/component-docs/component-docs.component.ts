import { Component, Input } from '@angular/core';

import { InstructionsItemComponent } from '../instructions-item';

@Component({
  selector: 'ngbd-component-docs',
  template: require('./component-docs.component.html'),
  directives: [InstructionsItemComponent]
})
export class ComponentDocsComponent {
  @Input() description: string;
  @Input() inputs: any[];
  @Input() name: string;
  @Input() outputs: any[];
}
