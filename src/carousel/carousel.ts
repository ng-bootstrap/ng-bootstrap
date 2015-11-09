import {Component, Input, Output, QueryList, EventEmitter, NgFor, Query, ViewChildren} from 'angular2/angular2';

@Component({
  selector: 'ngb-slide, [ngb-slide]',
  host: {'class': 'carousel-item', '[class.active]': 'isActive'},
  template: `<ng-content></ng-content>`
})
export class NgbSlide {
  public isActive: boolean = false;
}

@Component({
  selector: 'ngb-carousel, [ngb-carousel]',
  host: {'(activeChange)': 'activeChange.next(active)'},
  directives: [NgFor],
  template: `
    <div class="carousel slide">
      <ol class="carousel-indicators">
        <li *ng-for="#slide of slides" [class.active]="slide.isActive"></li>
      </ol>
      <div class="carousel-inner" role="listbox">
        <ng-content></ng-content>
      </div>
      <a class="left carousel-control" role="button" (click)="prev()">
        <span class="icon-prev" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <a class="right carousel-control" role="button" (click)="next()">
        <span class="icon-next" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>
    </div>
  `
})
export class NgbCarousel {
  @Input() private active: number;
  @Output() private activeChange: EventEmitter = new EventEmitter();
  @ViewChildren(NgbSlide) private slidesQuery: QueryList<NgbSlide>;
  private slides: NgbSlide[] = [];
  private activeIndex: number;

  constructor(@Query(NgbSlide) query: QueryList<NgbSlide>) { this.slidesQuery = query; }

  afterContentInit() {
    this.slides = this.slidesQuery.toArray();

    if (this.active >= 0 && this.active < this.slides.length) {
      this.select(this.slides[this.active]);
    } else {
      this.select(this.slides[0]);
    }
  }

  select(slide: NgbSlide): void {
    this.active = this.slides.indexOf(slide);

    this.slides.forEach((slide, idx) => { slide.isActive = this.active === idx; });
  }

  next(): void {
    let idx = this.active;
    let slides = this.slides;
    if (idx === slides.length - 1) {
      this.select(slides[0]);
    } else {
      this.select(slides[idx + 1]);
    }
  }

  prev(): void {
    let idx = this.active;
    let slides = this.slides;
    if (idx === 0) {
      this.select(slides[this.slides.length - 1]);
    } else {
      this.select(slides[idx - 1]);
    }
  }

  isActive(slide: NgbSlide): boolean { return this.activeIndex === this.slides.indexOf(slide); }
}
