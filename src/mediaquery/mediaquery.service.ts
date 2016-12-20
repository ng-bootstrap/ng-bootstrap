import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/distinctUntilChanged';

/**
 * Service allowing to get the current bootstrap breakpoint name (xs, sm, md, etc.) as an Observable.
 * This is useful, for example, if you want to insert or remove elements from the page based on the
 * current width of the viewport.
 */
@Injectable()
export class NgbMediaQuery {
  private _window: any;
  private _subject: BehaviorSubject<string>;
  private _sortedBreakPoints: Array<{name: string, minWidth: number}>;

  constructor() {
    this._window = window;
    this.configure({xs: 0, sm: 576, md: 768, lg: 992, xl: 1200});
  }

  /**
   * @internal
   * useful to pass a mock window for tests
   */
  setWindow(w) { this._window = w; }

  /**
   * Configures the service with custom breakpoints. This method, if called, should be called before
   * calling getMediaQuery(). The default breakpoints are
   * {
   *  xs: 0,
   *  sm: 576,
   *  md: 768,
   *  lg: 992,
   *  xl: 1200
   * }
   */
  configure(breakpoints: {[key: string]: number}) {
    this._sortedBreakPoints = [];
    Object.keys(breakpoints).forEach(name => this._sortedBreakPoints.push({name, minWidth: breakpoints[name]}));
    this._sortedBreakPoints.sort((a, b) => a.minWidth - b.minWidth);
  }

  /**
   * Returns an observable emitting the current bootstrap breakpoint name (xs, sm, md, etc.)
   */
  get(): Observable<string> {
    if (!this._subject) {
      this._subject = new BehaviorSubject<string>(this.computeBreakPoint());
      this._window.addEventListener('resize', () => this._subject.next(this.computeBreakPoint()));
    }

    return this._subject.distinctUntilChanged();
  }

  private computeBreakPoint() {
    // see http://stackoverflow.com/questions/1248081/get-the-browser-viewport-dimensions-with-javascript
    let width = Math.max(this._window.document.documentElement.clientWidth, this._window.innerWidth || 0);
    for (let i = this._sortedBreakPoints.length - 1; i >= 0; i--) {
      if (width >= this._sortedBreakPoints[i].minWidth) {
        return this._sortedBreakPoints[i].name;
      }
    }
    return this._sortedBreakPoints[0].name;
  }
}
