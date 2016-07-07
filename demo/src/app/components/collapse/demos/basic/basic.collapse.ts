import { Component } from '@angular/core';

import { NGB_COLLAPSE_DIRECTIVES } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ngbd-collapse-basic',
  template: require('./basic.collapse.html'),
  directives: [NGB_COLLAPSE_DIRECTIVES]
})
export class CollapseBasicComponent {
  private isCollapsed = false;
}
