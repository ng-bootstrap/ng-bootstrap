import {TestBed, ComponentFixture, inject} from '@angular/core/testing';
import {createGenericTestComponent} from '../util/tests';

import {Component} from '@angular/core';

import {NgbRatingModule} from './rating.module';
import {NgbRating} from './rating';
import {NgbRatingConfig} from './rating-config';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getAriaState(compiled) {
  const stars = getStars(compiled, '.sr-only');
  let state = [];
  for (let i = 0, l = stars.length; i < l; i++) {
    state.push((stars[i].textContent === '(*)' && stars[i].textContent !== '( )'));
  }
  return state;
}

function getStar(compiled, num: number) {
  return getStars(compiled)[num - 1];
}

function getStars(element, selector = 'span > span:not(.sr-only)') {
  return element.querySelectorAll(selector);
}

function getState(compiled) {
  const stars = getStars(compiled);
  let state = [];
  for (let i = 0, l = stars.length; i < l; i++) {
    state.push((stars[i].textContent === String.fromCharCode(9733)));
  }
  return state;
}

describe('ngb-rating', () => {
  beforeEach(() => { TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbRatingModule]}); });

  it('should initialize inputs with default values', () => {
    const defaultConfig = new NgbRatingConfig();
    const rating = new NgbRating(new NgbRatingConfig());
    expect(rating.max).toBe(defaultConfig.max);
    expect(rating.readonly).toBe(defaultConfig.readonly);
  });

  it('should show as many stars as the configured max by default', () => {
    const fixture = TestBed.createComponent(NgbRating);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;

    const stars = getStars(compiled);
    expect(stars.length).toBe(new NgbRatingConfig().max);
  });

  it('should change the num of stars with `max`', () => {
    const fixture = createTestComponent('<ngb-rating max="3"></ngb-rating>');

    const compiled = fixture.nativeElement;
    const stars = getStars(compiled);
    expect(stars.length).toBe(3);
  });

  it('initializes the default star icons as selected', () => {
    const fixture = createTestComponent('<ngb-rating rate="3" max="5"></ngb-rating>');

    const compiled = fixture.nativeElement;
    expect(getState(compiled)).toEqual([true, true, true, false, false]);
  });

  it('handles correctly the click event', () => {
    const fixture = createTestComponent('<ngb-rating rate="3" max="5"></ngb-rating>');

    const compiled = fixture.nativeElement;

    getStar(compiled, 2).click();
    fixture.detectChanges();
    expect(getState(compiled)).toEqual([true, true, false, false, false]);
  });

  it('should set pointer cursor on stars when not readonly', () => {
    const fixture = TestBed.createComponent(NgbRating);
    fixture.detectChanges();

    const compiled = fixture.nativeElement;

    expect(window.getComputedStyle(getStar(compiled, 1)).getPropertyValue('cursor')).toBe('pointer');
  });

  it('should set not allowed cursor on stars when readonly', () => {
    const fixture = createTestComponent('<ngb-rating [readonly]="true"></ngb-rating>');

    const compiled = fixture.nativeElement;

    expect(window.getComputedStyle(getStar(compiled, 1)).getPropertyValue('cursor')).toBe('not-allowed');
  });

  describe('aria support', () => {
    it('contains aria-valuemax with the number of stars', () => {
      const fixture = createTestComponent('<ngb-rating [max]="max"></ngb-rating>');

      const compiled = fixture.nativeElement;

      expect(compiled.querySelector('span').getAttribute('aria-valuemax')).toBe('10');
    });

    it('contains a hidden span for each star for screenreaders', () => {
      const fixture = createTestComponent('<ngb-rating max="5"></ngb-rating>');

      const compiled = fixture.nativeElement;
      const hiddenStars = getStars(compiled, '.sr-only');

      expect(hiddenStars.length).toBe(5);
    });

    it('initializes populates the current rate for screenreaders', () => {
      const fixture = createTestComponent('<ngb-rating rate="3" max="5"></ngb-rating>');

      const compiled = fixture.nativeElement;

      expect(getAriaState(compiled)).toEqual([true, true, true, false, false]);
    });

    it('contains aria-valuenow with the current rate', () => {
      const fixture = createTestComponent('<ngb-rating [max]="max" rate="3"></ngb-rating>');

      const compiled = fixture.nativeElement;

      expect(compiled.querySelector('span').getAttribute('aria-valuenow')).toBe('3');
    });

    it('updates aria-valuenow when the rate changes', () => {
      const fixture = createTestComponent('<ngb-rating [max]="max" rate="3"></ngb-rating>');

      const compiled = fixture.nativeElement;

      getStar(compiled, 7).click();
      fixture.detectChanges();

      expect(compiled.querySelector('span').getAttribute('aria-valuenow')).toBe('7');
    });
  });

  describe('Custom config', () => {
    let config: NgbRatingConfig;

    beforeEach(() => { TestBed.configureTestingModule({imports: [NgbRatingModule]}); });

    beforeEach(inject([NgbRatingConfig], (c: NgbRatingConfig) => {
      config = c;
      config.max = 5;
      config.readonly = true;
    }));

    it('should initialize inputs with provided config', () => {
      const fixture = TestBed.createComponent(NgbRating);
      fixture.detectChanges();

      let rating = fixture.componentInstance;
      expect(rating.max).toBe(config.max);
      expect(rating.readonly).toBe(config.readonly);
    });
  });

  describe('Custom config as provider', () => {
    let config = new NgbRatingConfig();
    config.max = 5;
    config.readonly = true;

    beforeEach(() => {
      TestBed.configureTestingModule(
          {imports: [NgbRatingModule], providers: [{provide: NgbRatingConfig, useValue: config}]});
    });

    it('should initialize inputs with provided config as provider', () => {
      const fixture = TestBed.createComponent(NgbRating);
      fixture.detectChanges();

      let rating = fixture.componentInstance;
      expect(rating.max).toBe(config.max);
      expect(rating.readonly).toBe(config.readonly);
    });
  });
});

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  max: number = 10;
}
