import { Component, Input } from '@angular/core';

@Component({
  selector: 'ngbd-instructions-item',
  template: require('./instructions-item.component.html')
})
export class InstructionsItemComponent {
  @Input() item: string;
  @Input() description: string;
}
