import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';

import {NgbMediaQuery} from '@ng-bootstrap/ng-bootstrap';

const WIDTHS = ['xs', 'sm', 'md', 'lg', 'xl'];

@Component({selector: 'ngbd-mediaquery-basic', templateUrl: 'mediaquery-basic.html'})
export class NgbdMediaQueryBasic implements OnInit, OnDestroy {

  width: string;
  mdOrUp: boolean;
  private subscription: Subscription;

  constructor(private mediaQuery: NgbMediaQuery) {
  }

  ngOnInit(): void {
    this.subscription = this.mediaQuery.get().subscribe(width => {
      this.width = width;
      this.mdOrUp = WIDTHS.indexOf(width) >= WIDTHS.indexOf('md');
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
