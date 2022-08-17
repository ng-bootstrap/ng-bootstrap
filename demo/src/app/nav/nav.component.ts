import {Component} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {of} from "rxjs";
import {NgbActiveOffcanvas} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html'
})
export class NavComponent {
  downloadCount = '';

  public activeOffcanvas: NgbActiveOffcanvas | undefined;

  constructor(
    httpClient: HttpClient) {
    if (environment.production) {
      httpClient.get<{ downloads: string }>('https://api.npmjs.org/downloads/point/last-month/@ng-bootstrap/ng-bootstrap')
        .pipe(map(data => data?.downloads))
        .subscribe({next: count => this.downloadCount = count.toLocaleString(), error: () => of('')});
    }
  }

  onLinkClick(): void {
    this.activeOffcanvas?.close();
  }

}
