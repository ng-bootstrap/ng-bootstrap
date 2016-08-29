import {Component, ChangeDetectionStrategy, Input} from '@angular/core';
import docs from '../../../../api-docs';

/**
 * Displays the API docs of a class, which is not a directive.
 *
 * For Config services, use NgbdApiDocsConfig instead.
 */
@Component({
  selector: 'ngbd-api-docs-class',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './api-docs-class.component.html'
})
export class NgbdApiDocsClass {
  apiDocs;
  @Input() set type(typeName) {
    this.apiDocs = docs[typeName];
  };

  methodSignature(method) {
    const args = method.args.map(arg => `${arg.name}: ${arg.type}`).join(', ');
    return `${method.name}(${args}): ${method.returnType}`;
  }
}
