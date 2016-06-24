import {
  Component,
  Directive,
  TemplateRef,
  ContentChildren,
  QueryList,
  Input,
  OnDestroy,
  AfterContentChecked,
  OnInit
} from '@angular/core';

@Directive({selector: 'template[ngbSlide]'})
export class NgbSlide {
  constructor(public tplRef: TemplateRef<any>) {}
}

@Component({
  selector: 'ngb-carousel',
  exportAs: 'ngbCarousel',
  host: {
    'class': 'carousel slide',
    '[style.display]': '"block"',
    'tabIndex': '0',
    '(mouseenter)': 'pause()',
    '(mouseleave)': 'cycle()',
    '(keyup.arrowLeft)': 'keyPrev()',
    '(keyup.arrowRight)': 'keyNext()'
  },
  template: `
    <ol class="carousel-indicators">
      <li *ngFor="let slide of _slides; let slideIdx = index" [class.active]="slideIdx === _activeIdx" (click)="select(slideIdx)"></li>
    </ol>
    <div class="carousel-inner" role="listbox">
      <div *ngFor="let slide of _slides; let slideIdx = index" class="carousel-item" [class.active]="slideIdx === _activeIdx">
        <template [ngTemplateOutlet]="slide.tplRef"></template>
      </div>
    </div>
    <a class="left carousel-control" role="button" (click)="prev()">
      <span class="icon-prev" aria-hidden="true"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a class="right carousel-control" role="button" (click)="next()">
      <span class="icon-next" aria-hidden="true"></span>
      <span class="sr-only">Next</span>
    </a>
    `
})
export class NgbCarousel implements AfterContentChecked,
    OnDestroy, OnInit {
  @ContentChildren(NgbSlide) private _slides: QueryList<NgbSlide>;
  private _activeIdx = 0;
  private _slideChangeInterval;

  @Input()
  set activeIdx(newActiveIdx: number) {
    this.select(newActiveIdx || 0);
    this._restartTimer();
  };

  @Input() interval: number = 5000;
  @Input() wrap: boolean = true;
  @Input() keyboard: boolean = true;

  ngAfterContentChecked() {
    // auto-correct _activeIdx that might have been set incorrectly as input
    this._activeIdx = Math.min(Math.max(0, this._activeIdx), this._slides.length - 1);
  }

  ngOnInit() { this.cycle(); }

  ngOnDestroy() { clearInterval(this._slideChangeInterval); }

  select(slideIdx: number) { this._activeIdx = slideIdx; }

  prev() {
    const prevIdx = this._activeIdx - 1;
    this.select(prevIdx < 0 ? (this.wrap ? prevIdx + this._slides.length : prevIdx + 1) : prevIdx);
    this._restartTimer();
  }

  next() {
    this._cycleToNext();
    this._restartTimer();
  }

  keyPrev() {
    if (this.keyboard) {
      this.prev();
    }
  }

  keyNext() {
    if (this.keyboard) {
      this.next();
    }
  }

  pause() { clearInterval(this._slideChangeInterval); }

  cycle() {
    this._slideChangeInterval = setInterval(() => { this._cycleToNext(); }, this.interval);
  }

  private _cycleToNext() {
    const nextIdx = this._activeIdx + 1;
    this.select(nextIdx >= this._slides.length ? (this.wrap ? 0 : nextIdx - 1) : nextIdx);
  }

  private _restartTimer() {
    this.pause();
    this.cycle();
  }
}

export const NGB_CAROUSEL_DIRECTIVES = [NgbCarousel, NgbSlide];
