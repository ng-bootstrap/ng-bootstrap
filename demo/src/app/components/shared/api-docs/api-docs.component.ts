import {Component, ChangeDetectionStrategy, Input} from '@angular/core';
import docs from '../../../../api-docs';
import {PropertyDesc, DirectiveDesc, InputDesc, MethodDesc, ClassDesc, signature} from './api-docs.model';

/**
 * Displays the API docs of a directive.
 *
 * The default values of its inputs are looked for in the directive api doc itself, or in the matching property
 * of associated Config service, if any.
 *
 * The config service of a directive NgbFoo is, by convention, named NgbFooConfig.
 */
@Component({
  selector: 'ngbd-api-docs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './api-docs.component.html'
})
export class NgbdApiDocs {

  /**
   * Object which contains, for each input name of the directive, the corresponding property of the associated config
   * service (if any)
   */
  private _configProperties: {[propertyName: string]: PropertyDesc};

  apiDocs: DirectiveDesc;
  configServiceName: string;

  @Input() set directive(directiveName: string) {
    this.apiDocs = docs[directiveName];
    this.configServiceName = `${directiveName}Config`;
    const configApiDocs = docs[this.configServiceName];
    this._configProperties = {};
    if (configApiDocs) {
      this.apiDocs.inputs.forEach(
        input => this._configProperties[input.name] = this._findInputConfigProperty(configApiDocs, input));
    }
  };

  /**
   * Returns the default value of the given directive input. If falsy, returns the default value of the matching
   * config service property
   */
  defaultInputValue(input: InputDesc): string {
    if (input.defaultValue !== undefined) {
      return input.defaultValue;
    }

    const configProperty = this._configProperties[input.name];
    return (configProperty && configProperty.defaultValue);
  }

  /**
   * Returns true if there is a config service property matching with the given directive input
   */
  hasConfigProperty(input: InputDesc): boolean {
    return !!this._configProperties[input.name];
  }

  methodSignature(method: MethodDesc): string { return signature(method); }

  private _findInputConfigProperty(configApiDocs: ClassDesc, input: InputDesc): PropertyDesc {
    return configApiDocs.properties.filter(prop => prop.name === input.name)[0];
  }
}
