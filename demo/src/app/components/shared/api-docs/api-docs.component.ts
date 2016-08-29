import {Component, ChangeDetectionStrategy, Input} from '@angular/core';
import docs from '../../../../api-docs';

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
  private _configProperties;

  apiDocs;
  configServiceName;

  @Input() set directive(directiveName) {
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
  defaultInputValue(input) {
    if (input.defaultValue !== undefined) {
      return input.defaultValue;
    }

    const configProperty = this._configProperties[input.name];
    return (configProperty && configProperty.defaultValue);
  }

  /**
   * Returns true if there is a config service property matching with the given directive input
   */
  hasConfigProperty(input) {
    return !!this._configProperties[input.name];
  }

  methodSignature(method) {
    const args = method.args.map(arg => `${arg.name}: ${arg.type}`).join(', ');
    return `${method.name}(${args})`;
  }

  private _findInputConfigProperty(configApiDocs, input) {
    return configApiDocs.properties.filter(prop => prop.name === input.name)[0];
  }
}
