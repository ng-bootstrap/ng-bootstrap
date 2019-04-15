import {Component} from '@angular/core';
import {Snippet} from '../shared/code/snippet';

@Component({
  selector: 'ngbd-getting-started',
  templateUrl: './getting-started.component.html'
})
export class GettingStarted {
  codeInstall = Snippet({
    lang: 'bash',
    code: `npm install --save @ng-bootstrap/ng-bootstrap`,
  });

  codeRoot = Snippet({
    lang: 'typescript',
    code: `
      import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

      @NgModule({
        ...
        imports: [NgbModule, ...],
        ...
      })
      export class YourAppModule {
      }
    `,
  });

  codeOther = Snippet({
    lang: 'typescript',
    code: `
      import {NgbPaginationModule, NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';

      @NgModule({
        ...
        imports: [NgbPaginationModule, NgbAlertModule, ...],
        ...
      })
      export class YourAppModule {
      }
    `,
  });

  codeSystem = Snippet({
    lang: 'typescript',
    code: `
      map: {
        '@ng-bootstrap/ng-bootstrap': 'node_modules/@ng-bootstrap/ng-bootstrap/bundles/ng-bootstrap.js',
      }
    `,
  });
}
