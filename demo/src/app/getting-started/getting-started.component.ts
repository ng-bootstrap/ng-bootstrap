import {Component} from '@angular/core';

@Component({
  selector: 'ngbd-getting-started',
  templateUrl: './getting-started.component.html'
})
export class GettingStarted {

  codeInstall = `npm install --save @ng-bootstrap/ng-bootstrap`;

  codeImport = `import {NgbModule} from '@ng-bootstrap/ng-bootstrap';`;

  codeRoot = `
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [AppComponent, ...],
  imports: [NgbModule.forRoot(), ...],
  bootstrap: [AppComponent]
})
export class AppModule {
}`;

  codeOther = `
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [OtherComponent, ...],
  imports: [NgbModule, ...]
})
export class OtherModule {
}`;

  codeSystem = `
map: {
  '@ng-bootstrap/ng-bootstrap': 'node_modules/@ng-bootstrap/ng-bootstrap/bundles/ng-bootstrap.js',
}`;
}
