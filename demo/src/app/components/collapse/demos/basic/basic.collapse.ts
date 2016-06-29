import { Component } from '@angular/core';

import { NgbCollapse } from '@ng-bootstrap/collapse';

@Component({
  selector: 'ngbd-collapse-basic',
  template: require('./basic.collapse.html'),
  directives: [NgbCollapse]
})
export class CollapseBasicComponent {
  private isCollapsed = false;
}
