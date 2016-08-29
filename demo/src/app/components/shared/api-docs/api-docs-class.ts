import {Component, ChangeDetectionStrategy, Input} from '@angular/core';
import docs from '../../../../api-docs';

@Component({
  selector: 'ngbd-api-docs-class',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './api-docs-class.component.html'
})
export class NgbdApiDocsClass {
  apiDocs;
  @Input() set type(directiveName) {
    this.apiDocs = docs[directiveName];
  };

  private _methodSignature(method) {
    const args = method.args.map(arg => `${arg.name}: ${arg.type}`).join(', ');
    return `${method.name}(${args})`;
  }
}
