import {
  AfterContentChecked,
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  Directive,
  EventEmitter,
  Inject,
  Input,
  NgZone,
  OnDestroy,
  Output,
  PLATFORM_ID,
  QueryList,
  TemplateRef,
  HostListener
} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';

import {NgbCarouselConfig} from './carousel-config';

import {Subject, timer, BehaviorSubject, combineLatest, NEVER} from 'rxjs';
import {startWith, map, switchMap, takeUntil, distinctUntilChanged} from 'rxjs/operators';

let nextId = 0;

/**
 * A directive that wraps the individual carousel slide.
 */
@Directive({selector: 'ng-template[ngbSlide]'})
export class NgbSlide {
  /**
   * Slide id that must be unique for the entire document.
   *
   * If not provided, will be generated in the `ngb-slide-xx` format.
   */
  @Input() id = `ngb-slide-${nextId++}`;
  constructor(public tplRef: TemplateRef<any>) {}
}

/**
 * Carousel is a component to easily create and control slideshows.
 *
 * Allows to set intervals, change the way user interacts with the slides and provides a programmatic API.
 */
@Component({
  selector: 'ngb-carousel',
  exportAs: 'ngbCarousel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'carousel slide',
    '[style.display]': '"block"',
    'tabIndex': '0',
    '(keydown.arrowLeft)': 'keyboard && prev(NgbSlideEventSource.ARROW_LEFT)',
    '(keydown.arrowRight)': 'keyboard && next(NgbSlideEventSource.ARROW_RIGHT)'
  },
  template: `
    <ol class="carousel-indicators" *ngIf="showNavigationIndicators">
      <li *ngFor="let slide of slides" [id]="slide.id" [class.active]="slide.id === activeId"
          (click)="select(slide.id, NgbSlideEventSource.INDICATOR)"></li>
    </ol>
    <div class="carousel-inner">
      <div *ngFor="let slide of slides" class="carousel-item" [class.active]="slide.id === activeId">
        <ng-template [ngTemplateOutlet]="slide.tplRef"></ng-template>
      </div>
    </div>
    <a class="carousel-control-prev" role="button" (click)="prev(NgbSlideEventSource.ARROW_LEFT)" *ngIf="showNavigationArrows">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="sr-only" i18n="@@ngb.carousel.previous">Previous</span>
    </a>
    <a class="carousel-control-next" role="button" (click)="next(NgbSlideEventSource.ARROW_RIGHT)" *ngIf="showNavigationArrows">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="sr-only" i18n="@@ngb.carousel.next">Next</span>
    </a>
  `
})
export class NgbCarousel implements AfterContentChecked,
    AfterContentInit, OnDestroy {
  @ContentChildren(NgbSlide) slides: QueryList<NgbSlide>;

  public NgbSlideEventSource = NgbSlideEventSource;

  private _destroy$ = new Subject<void>();
  private _interval$ = new BehaviorSubject(0);
  private _mouseHover$ = new BehaviorSubject(false);
  private _pauseOnHover$ = new BehaviorSubject(false);
  private _pause$ = new BehaviorSubject(false);
  private _wrap$ = new BehaviorSubject(false);

  /**
   * The slide id that should be displayed **initially**.
   *
   * For subsequent interactions use methods `select()`, `next()`, etc. and the `(slide)` output.
   */
  @Input() activeId: string;

  /**
   * Time in milliseconds before the next slide is shown.
   */
  @Input()
  set interval(value: number) {
    this._interval$.next(value);
  }

  get interval() { return this._interval$.value; }

  /**
   * If `true`, will 'wrap' the carousel by switching from the last slide back to the first.
   */
  @Input()
  set wrap(value: boolean) {
    this._wrap$.next(value);
  }

  get wrap() { return this._wrap$.value; }

  /**
   * If `true`, allows to interact with carousel using keyboard 'arrow left' and 'arrow right'.
   */
  @Input() keyboard: boolean;

  /**
   * If `true`, will pause slide switching when mouse cursor hovers the slide.
   *
   * @since 2.2.0
   */
  @Input()
  set pauseOnHover(value: boolean) {
    this._pauseOnHover$.next(value);
  }

  get pauseOnHover() { return this._pauseOnHover$.value; }

  /**
   * If `true`, 'previous' and 'next' navigation arrows will be visible on the slide.
   *
   * @since 2.2.0
   */
  @Input() showNavigationArrows: boolean;

  /**
   * If `true`, navigation indicators at the bottom of the slide will be visible.
   *
   * @since 2.2.0
   */
  @Input() showNavigationIndicators: boolean;

  /**
   * An event emitted right after the slide transition is completed.
   *
   * See [`NgbSlideEvent`](#/components/carousel/api#NgbSlideEvent) for payload details.
   */
  @Output() slide = new EventEmitter<NgbSlideEvent>();

  constructor(
      config: NgbCarouselConfig, @Inject(PLATFORM_ID) private _platformId, private _ngZone: NgZone,
      private _cd: ChangeDetectorRef) {
    this.interval = config.interval;
    this.wrap = config.wrap;
    this.keyboard = config.keyboard;
    this.pauseOnHover = config.pauseOnHover;
    this.showNavigationArrows = config.showNavigationArrows;
    this.showNavigationIndicators = config.showNavigationIndicators;
  }

  @HostListener('mouseenter')
  mouseEnter() {
    this._mouseHover$.next(true);
  }

  @HostListener('mouseleave')
  mouseLeave() {
    this._mouseHover$.next(false);
  }

  ngAfterContentInit() {
    // setInterval() doesn't play well with SSR and protractor,
    // so we should run it in the browser and outside Angular
    if (isPlatformBrowser(this._platformId)) {
      this._ngZone.runOutsideAngular(() => {
        const hasNextSlide$ = combineLatest(
                                  this.slide.pipe(map(slideEvent => slideEvent.current), startWith(this.activeId)),
                                  this._wrap$, this.slides.changes.pipe(startWith(null)))
                                  .pipe(
                                      map(([currentSlideId, wrap]) => {
                                        const slideArr = this.slides.toArray();
                                        const currentSlideIdx = this._getSlideIdxById(currentSlideId);
                                        return wrap ? slideArr.length > 1 : currentSlideIdx < slideArr.length - 1;
                                      }),
                                      distinctUntilChanged());
        combineLatest(this._pause$, this._pauseOnHover$, this._mouseHover$, this._interval$, hasNextSlide$)
            .pipe(
                map(([pause, pauseOnHover, mouseHover, interval, hasNextSlide]) =>
                        ((pause || (pauseOnHover && mouseHover) || !hasNextSlide) ? 0 : interval)),

                distinctUntilChanged(), switchMap(interval => interval > 0 ? timer(interval, interval) : NEVER),
                takeUntil(this._destroy$))
            .subscribe(() => this._ngZone.run(() => this.next(NgbSlideEventSource.TIMER)));
      });
    }

    this.slides.changes.pipe(takeUntil(this._destroy$)).subscribe(() => this._cd.markForCheck());
  }

  ngAfterContentChecked() {
    let activeSlide = this._getSlideById(this.activeId);
    this.activeId = activeSlide ? activeSlide.id : (this.slides.length ? this.slides.first.id : null);
  }

  ngOnDestroy() { this._destroy$.next(); }

  /**
   * Navigates to a slide with the specified identifier.
   */
  select(slideId: string, source?: NgbSlideEventSource) {
    this._cycleToSelected(slideId, this._getSlideEventDirection(this.activeId, slideId), source);
  }

  /**
   * Navigates to the previous slide.
   */
  prev(source?: NgbSlideEventSource) {
    this._cycleToSelected(this._getPrevSlide(this.activeId), NgbSlideEventDirection.RIGHT, source);
  }

  /**
   * Navigates to the next slide.
   */
  next(source?: NgbSlideEventSource) {
    this._cycleToSelected(this._getNextSlide(this.activeId), NgbSlideEventDirection.LEFT, source);
  }

  /**
   * Pauses cycling through the slides.
   */
  pause() { this._pause$.next(true); }

  /**
   * Restarts cycling through the slides from left to right.
   */
  cycle() { this._pause$.next(false); }

  private _cycleToSelected(slideIdx: string, direction: NgbSlideEventDirection, source?: NgbSlideEventSource) {
    let selectedSlide = this._getSlideById(slideIdx);
    if (selectedSlide && selectedSlide.id !== this.activeId) {
      this.slide.emit(
          {prev: this.activeId, current: selectedSlide.id, direction: direction, paused: this._pause$.value, source});
      this.activeId = selectedSlide.id;
    }

    // we get here after the interval fires or any external API call like next(), prev() or select()
    this._cd.markForCheck();
  }

  private _getSlideEventDirection(currentActiveSlideId: string, nextActiveSlideId: string): NgbSlideEventDirection {
    const currentActiveSlideIdx = this._getSlideIdxById(currentActiveSlideId);
    const nextActiveSlideIdx = this._getSlideIdxById(nextActiveSlideId);

    return currentActiveSlideIdx > nextActiveSlideIdx ? NgbSlideEventDirection.RIGHT : NgbSlideEventDirection.LEFT;
  }

  private _getSlideById(slideId: string): NgbSlide { return this.slides.find(slide => slide.id === slideId); }

  private _getSlideIdxById(slideId: string): number {
    return this.slides.toArray().indexOf(this._getSlideById(slideId));
  }

  private _getNextSlide(currentSlideId: string): string {
    const slideArr = this.slides.toArray();
    const currentSlideIdx = this._getSlideIdxById(currentSlideId);
    const isLastSlide = currentSlideIdx === slideArr.length - 1;

    return isLastSlide ? (this.wrap ? slideArr[0].id : slideArr[slideArr.length - 1].id) :
                         slideArr[currentSlideIdx + 1].id;
  }

  private _getPrevSlide(currentSlideId: string): string {
    const slideArr = this.slides.toArray();
    const currentSlideIdx = this._getSlideIdxById(currentSlideId);
    const isFirstSlide = currentSlideIdx === 0;

    return isFirstSlide ? (this.wrap ? slideArr[slideArr.length - 1].id : slideArr[0].id) :
                          slideArr[currentSlideIdx - 1].id;
  }
}

/**
 * A slide change event emitted right after the slide transition is completed.
 */
export interface NgbSlideEvent {
  /**
   * The previous slide id.
   */
  prev: string;

  /**
   * The current slide id.
   */
  current: string;

  /**
   * The slide event direction.
   *
   * Possible values are `'left' | 'right'`.
   */
  direction: NgbSlideEventDirection;

  /**
   * Whether the pause() method was called (and no cycle() call was done afterwards).
   *
   * @since 5.1.0
   */
  paused: boolean;

  /**
   * Source triggering the slide change event.
   *
   * Possible values are `'timer' | 'arrowLeft' | 'arrowRight' | 'indicator'`
   *
   * @since 5.1.0
   */
  source?: NgbSlideEventSource;
}

/**
 * Defines the carousel slide transition direction.
 */
export enum NgbSlideEventDirection {
  LEFT = <any>'left',
  RIGHT = <any>'right'
}

export enum NgbSlideEventSource {
  TIMER = 'timer',
  ARROW_LEFT = 'arrowLeft',
  ARROW_RIGHT = 'arrowRight',
  INDICATOR = 'indicator'
}

export const NGB_CAROUSEL_DIRECTIVES = [NgbCarousel, NgbSlide];
