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

let nextId = 0;

@Directive({selector: 'template[ngbSlide]'})
export class NgbSlide {
  @Input() id = `ngb-slide-${nextId++}`;
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
      <li *ngFor="let slide of _slides" [id]="slide.id" [class.active]="slide.id === activeId" (click)="select(slide.id)"></li>
    </ol>
    <div class="carousel-inner" role="listbox">
      <div *ngFor="let slide of _slides" class="carousel-item" [class.active]="slide.id === activeId">
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
  private _slideChangeInterval;

  @Input() interval = 5000;
  @Input() wrap = true;
  @Input() keyboard = true;
  @Input() activeId: string;

  ngAfterContentChecked() {
    let activeSlide = this._getSlideById(this.activeId);
    this.activeId = activeSlide ? activeSlide.id : (this._slides.length ? this._slides.first.id : null);
  }

  ngOnInit() { this.cycle(); }

  ngOnDestroy() { clearInterval(this._slideChangeInterval); }

  select(slideIdx: string) {
    let selectedSlide = this._getSlideById(slideIdx);
    if (selectedSlide) {
      this.activeId = selectedSlide.id;
    }
  }

  prev() {
    let selectedId: string = this._getPrevSlide(this.activeId);
    this.select(selectedId);
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
    let selectedId: string = this._getNextSlide(this.activeId);
    this.select(selectedId);
  }

  private _restartTimer() {
    this.pause();
    this.cycle();
  }

  private _getSlideById(slideIdx: string): NgbSlide {
    let slideWithId: NgbSlide[] = this._slides.filter(slide => slide.id === slideIdx);
    return slideWithId.length ? slideWithId[0] : null;
  }

  private _getNextSlide(id: string): string {
    let nextSlideId = id;
    let slideArr = this._slides.toArray();

    slideArr.forEach((slide, idx) => {
      if (slide.id === id) {
        let lastSlide: boolean = (idx === (slideArr.length - 1));
        nextSlideId =
            lastSlide ? (this.wrap ? slideArr[0].id : slideArr[slideArr.length - 1].id) : slideArr[idx + 1].id;
      }
    });
    return nextSlideId;
  }

  private _getPrevSlide(id: string): string {
    let prevSlideId = id;
    let slideArr = this._slides.toArray();

    slideArr.forEach((slide, idx) => {
      if (slide.id === id) {
        prevSlideId =
            idx === 0 ? (this.wrap ? slideArr[slideArr.length - 1].id : slideArr[0].id) : slideArr[idx - 1].id;
      }
    });
    return prevSlideId;
  }
}

export const NGB_CAROUSEL_DIRECTIVES = [NgbCarousel, NgbSlide];
