import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {NgbActiveOffcanvas} from "@ng-bootstrap/ng-bootstrap";
import {SideNavComponent} from "./side-nav.component";

@Component({
  selector: 'ngbd-side-nav-offcanvas',
  templateUrl: './side-nav.component.html',
})
export class SideNavOffcanvasComponent extends SideNavComponent {
  public activeOffcanvas: NgbActiveOffcanvas | undefined;

  constructor(router: Router, activeOffcanvas: NgbActiveOffcanvas) {
    super(router);
    this.activeOffcanvas = activeOffcanvas;
  }
}
