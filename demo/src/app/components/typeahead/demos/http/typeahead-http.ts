import {Component, Input} from '@angular/core';
import {HTTP_PROVIDERS, JSONP_PROVIDERS} from '@angular/http';
import {NGB_TYPEAHEAD_DIRECTIVES, NGB_PRECOMPILE} from '@ng-bootstrap/ng-bootstrap';

import {Injectable} from '@angular/core';
import {Jsonp, URLSearchParams} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class WikipediaService {
  constructor(private _jsonp: Jsonp) {}

  search(term: string) {
    let wikiUrl = 'https://en.wikipedia.org/w/api.php';
    let params = new URLSearchParams();
    params.set('search', term);
    params.set('action', 'opensearch');
    params.set('format', 'json');
    params.set('callback', 'JSONP_CALLBACK');

    return this._jsonp
      .get(wikiUrl, {search: params})
      .map(response => <string[]> response.json()[1]);
  }
}

@Component({
  selector: 'ngbd-typeahead-http',
  template: require('./typeahead-http.html'),
  directives: [NGB_TYPEAHEAD_DIRECTIVES],
  precompile: [NGB_PRECOMPILE],
  providers: [HTTP_PROVIDERS, JSONP_PROVIDERS, WikipediaService],
  styles: [`.form-control { width: 300px; display: inline; }`]
})
export class NgbdTypeaheadHttp {

  private _searching: boolean;

  constructor(private _service: WikipediaService) {}

  search = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(term => { this._searching = term.length > 0; })
      .switchMap(term => term === '' ? Observable.of([]) : this._service.search(term))
      .do(() => { this._searching = false; });
}
