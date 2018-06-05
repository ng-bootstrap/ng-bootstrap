import {
  Component,
  Directive,
  TemplateRef,
  ContentChildren,
  QueryList,
  Input,
  AfterContentChecked,
  OnInit,
  OnChanges,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import {NgbCarouselConfig} from './carousel-config';

let nextId = 0;

/**
 * Represents an individual slide to be used within a carousel.
 */
@Directive({selector: 'ng-template[ngbSlide]'})
export class NgbSlide {
  /**
   * Unique slide identifier. Must be unique for the entire document for proper accessibility support.
   * Will be auto-generated if not provided.
   */
  @Input() id = `ngb-slide-${nextId++}`;
  constructor(public tplRef: TemplateRef<any>) {}
}

/**
 * Directive to easily create carousels based on Bootstrap's markup.
 */
@Component({
  selector: 'ngb-carousel',
  exportAs: 'ngbCarousel',
  host: {
    'class': 'carousel slide',
    '[style.display]': '"block"',
    'tabIndex': '0',
    '(mouseenter)': 'mouseEventPause()',
    '(mouseleave)': 'mouseEventCycle()',
    '(keydown.arrowLeft)': 'keyPrev()',
    '(keydown.arrowRight)': 'keyNext()'
  },
  template: `
    <ol class="carousel-indicators">
      <li *ngFor="let slide of slides" [id]="slide.id" [class.active]="slide.id === activeId"
          (click)="cycleToSelected(slide.id, getSlideEventDirection(activeId, slide.id))"></li>
    </ol>
    <div class="carousel-inner">
      <div *ngFor="let slide of slides" class="carousel-item" [class.active]="slide.id === activeId">
        <ng-template [ngTemplateOutlet]="slide.tplRef"></ng-template>
      </div>
    </div>
    <a class="carousel-control-prev" role="button" (click)="cycleToPrev()">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="sr-only" i18n="@@ngb.carousel.previous">Previous</span>
    </a>
    <a class="carousel-control-next" role="button" (click)="cycleToNext()">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="sr-only" i18n="@@ngb.carousel.next">Next</span>
    </a>
    `
})
export class NgbCarousel implements AfterContentChecked,
    OnDestroy, OnInit, OnChanges {
  @ContentChildren(NgbSlide) slides: QueryList<NgbSlide>;
  private _slideChangeInterval;

  /**
   * Amount of time in milliseconds before next slide is shown.
   */
  @Input() interval: number;

  /**
   * Whether can wrap from the last to the first slide.
   */
  @Input() wrap: boolean;

  /**
   * A flag for allowing navigation via keyboard
   */
  @Input() keyboard: boolean;

  /**
   * A flag to enable/disable mouse events
   */
  @Input() mouse: boolean;
  /**
   * The active slide id.
   */
  @Input() activeId: string;

  /**
   * A carousel slide event fired when the slide transition is completed.
   * See NgbSlideEvent for payload details
   */
  @Output() slide = new EventEmitter<NgbSlideEvent>();

  constructor(config: NgbCarouselConfig) {
    this.interval = config.interval;
    this.wrap = config.wrap;
    this.keyboard = config.keyboard;
    this.mouse = config.mouse;
  }

  ngAfterContentChecked() {
    let activeSlide = this._getSlideById(this.activeId);
    this.activeId = activeSlide ? activeSlide.id : (this.slides.length ? this.slides.first.id : null);
  }

  ngOnInit() { this._startTimer(); }

  ngOnChanges(changes) {
    if ('interval' in changes && !changes['interval'].isFirstChange()) {
      this._restartTimer();
    }
  }

  ngOnDestroy() { clearInterval(this._slideChangeInterval); }

  /**
   * Navigate to a slide with the specified identifier.
   */
  select(slideId: string) {
    this.cycleToSelected(slideId, this.getSlideEventDirection(this.activeId, slideId));
    this._restartTimer();
  }

  /**
   * Navigate to the next slide.
   */
  prev() {
    this.cycleToPrev();
    this._restartTimer();
  }

  /**
   * Navigate to the next slide.
   */
  next() {
    this.cycleToNext();
    this._restartTimer();
  }

  /**
   * Stops the carousel from cycling through items.
   */
  pause() { this._stopTimer(); }

  /**
   * Restarts cycling through the carousel slides from left to right.
   */
  cycle() { this._startTimer(); }

  cycleToNext() { this.cycleToSelected(this._getNextSlide(this.activeId), NgbSlideEventDirection.LEFT); }

  cycleToPrev() { this.cycleToSelected(this._getPrevSlide(this.activeId), NgbSlideEventDirection.RIGHT); }

  cycleToSelected(slideIdx: string, direction: NgbSlideEventDirection) {
    let selectedSlide = this._getSlideById(slideIdx);
    if (selectedSlide) {
      if (selectedSlide.id !== this.activeId) {
        this.slide.emit({prev: this.activeId, current: selectedSlide.id, direction: direction});
      }
      this.activeId = selectedSlide.id;
    }
  }

  getSlideEventDirection(currentActiveSlideId: string, nextActiveSlideId: string): NgbSlideEventDirection {
    const currentActiveSlideIdx = this._getSlideIdxById(currentActiveSlideId);
    const nextActiveSlideIdx = this._getSlideIdxById(nextActiveSlideId);

    return currentActiveSlideIdx > nextActiveSlideIdx ? NgbSlideEventDirection.RIGHT : NgbSlideEventDirection.LEFT;
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

  mouseEventPause() {
    if (this.mouse) {
      this.pause();
    }
  }

  mouseEventCycle() {
    if (this.mouse) {
      this.cycle();
    }
  }

  private _restartTimer() {
    this._stopTimer();
    this._startTimer();
  }

  private _startTimer() {
    if (this.interval > 0) {
      this._slideChangeInterval = setInterval(() => { this.cycleToNext(); }, this.interval);
    }
  }

  private _stopTimer() { clearInterval(this._slideChangeInterval); }

  private _getSlideById(slideId: string): NgbSlide {
    let slideWithId: NgbSlide[] = this.slides.filter(slide => slide.id === slideId);
    return slideWithId.length ? slideWithId[0] : null;
  }

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
* The payload of the slide event fired when the slide transition is completed
*/
export interface NgbSlideEvent {
  /**
   * Previous slide id
   */
  prev: string;

  /**
   * New slide ids
   */
  current: string;

  /**
   * Slide event direction
   */
  direction: NgbSlideEventDirection;
}

/**
 * Enum to define the carousel slide event direction
 */
export enum NgbSlideEventDirection {
  LEFT = <any>'left',
  RIGHT = <any>'right'
}

export const NGB_CAROUSEL_DIRECTIVES = [NgbCarousel, NgbSlide];
