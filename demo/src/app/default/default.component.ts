import {Component} from '@angular/core';

// This imported module is automatically generated during the build of the application
import version from './version';

@Component({
  selector: 'ngbd-default',
  templateUrl: './default.component.html'
})
export class DefaultComponent {
  public version: string = version;
}
