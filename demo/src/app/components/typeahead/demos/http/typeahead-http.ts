import { Component, inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, OperatorFunction } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { JsonPipe } from '@angular/common';

const WIKI_URL = 'https://en.wikipedia.org/w/api.php';
const PARAMS = new HttpParams({
	fromObject: {
		action: 'opensearch',
		format: 'json',
		origin: '*',
	},
});

@Injectable()
export class WikipediaService {
	private http = inject(HttpClient);

	search(term: string) {
		if (term === '') {
			return of([]);
		}

		return this.http
			.get<[any, string[]]>(WIKI_URL, { params: PARAMS.set('search', term) })
			.pipe(map((response) => response[1]));
	}
}

@Component({
	selector: 'ngbd-typeahead-http',
	imports: [NgbTypeaheadModule, FormsModule, JsonPipe],
	templateUrl: './typeahead-http.html',
	providers: [WikipediaService],
	styles: `.form-control { width: 300px; }`,
})
export class NgbdTypeaheadHttp {
	private service = inject(WikipediaService);

	model: any;
	searching = false;
	searchFailed = false;

	search: OperatorFunction<string, readonly string[]> = (text$: Observable<string>) =>
		text$.pipe(
			debounceTime(300),
			distinctUntilChanged(),
			tap(() => (this.searching = true)),
			switchMap((term) =>
				this.service.search(term).pipe(
					tap(() => (this.searchFailed = false)),
					catchError(() => {
						this.searchFailed = true;
						return of([]);
					}),
				),
			),
			tap(() => (this.searching = false)),
		);
}
