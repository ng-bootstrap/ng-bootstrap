import {Component} from "@angular/core";
import {NgbActiveOffcanvas} from "../../../../src";
import {HttpClient} from "@angular/common/http";
import {NavComponent} from "./nav.component";

@Component({
  selector: 'app-nav-offcanvas',
  templateUrl: './nav.component.html'
})
export class NavOffcanvasComponent extends NavComponent {
  constructor(
    activeOffcanvas: NgbActiveOffcanvas,
    httpClient: HttpClient) {
    super(httpClient);
    this.activeOffcanvas = activeOffcanvas;
  }
}
