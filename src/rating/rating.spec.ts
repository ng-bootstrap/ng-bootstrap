import {TestBed, ComponentFixture, inject} from '@angular/core/testing';
import {createGenericTestComponent} from '../test/common';

import {Component} from '@angular/core';

import {NgbRatingModule} from './rating.module';
import {NgbRating} from './rating';
import {NgbRatingConfig} from './rating-config';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getAriaState(compiled) {
  const stars = getStars(compiled, '.sr-only');
  return stars.map(star => star.textContent === '(*)' && star.textContent !== '( )');
}

function getStar(compiled, num: number) {
  return getStars(compiled)[num - 1];
}

function getStars(element, selector = 'span > span:not(.sr-only)') {
  return <HTMLElement[]>Array.from(element.querySelectorAll(selector));
}

function getState(compiled) {
  const stars = getStars(compiled);
  return stars.map(star => star.textContent.trim() === String.fromCharCode(9733));
}

function getStateText(compiled) {
  const stars = getStars(compiled);
  return stars.map(star => star.textContent.trim());
}

describe('ngb-rating', () => {
  beforeEach(
      () => { TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbRatingModule.forRoot()]}); });

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

  it('should allow custom star template', () => {
    const fixture = createTestComponent(`
      <template #t let-fill="fill">{{ fill === 100 ? 'x' : 'o' }}</template>
      <ngb-rating [starTemplate]="t" rate="2" max="4"></ngb-rating>`);

    const compiled = fixture.nativeElement;
    expect(getStateText(compiled)).toEqual(['x', 'x', 'o', 'o']);
  });

  it('should allow custom template as a child element', () => {
    const fixture = createTestComponent(`
      <ngb-rating rate="2" max="4">
        <template let-fill="fill">{{ fill === 100 ? 'x' : 'o' }}</template>
      </ngb-rating>`);

    const compiled = fixture.nativeElement;
    expect(getStateText(compiled)).toEqual(['x', 'x', 'o', 'o']);
  });

  it('should prefer explicitly set custom template to a child one', () => {
    const fixture = createTestComponent(`
      <template #t let-fill="fill">{{ fill === 100 ? 'a' : 'b' }}</template>
      <ngb-rating [starTemplate]="t" rate="2" max="4">
        <template let-fill="fill">{{ fill === 100 ? 'c' : 'd' }}</template>
      </ngb-rating>`);

    const compiled = fixture.nativeElement;
    expect(getStateText(compiled)).toEqual(['a', 'a', 'b', 'b']);
  });

  it('should calculate fill percentage correctly', () => {
    const fixture = createTestComponent(`
      <template #t let-fill="fill">{{fill}}</template>
      <ngb-rating [starTemplate]="t" [rate]="rate" max="4"></ngb-rating>`);

    const compiled = fixture.nativeElement;
    expect(getStateText(compiled)).toEqual(['100', '100', '100', '0']);

    fixture.componentInstance.rate = 0;
    fixture.detectChanges();
    expect(getStateText(compiled)).toEqual(['0', '0', '0', '0']);

    fixture.componentInstance.rate = 2.2;
    fixture.detectChanges();
    expect(getStateText(compiled)).toEqual(['100', '100', '20', '0']);

    fixture.componentInstance.rate = 2.25;
    fixture.detectChanges();
    expect(getStateText(compiled)).toEqual(['100', '100', '25', '0']);

    fixture.componentInstance.rate = 2.2548;
    fixture.detectChanges();
    expect(getStateText(compiled)).toEqual(['100', '100', '25', '0']);

    fixture.componentInstance.rate = 7;
    fixture.detectChanges();
    expect(getStateText(compiled)).toEqual(['100', '100', '100', '100']);
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

    beforeEach(() => { TestBed.configureTestingModule({imports: [NgbRatingModule.forRoot()]}); });

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
          {imports: [NgbRatingModule.forRoot()], providers: [{provide: NgbRatingConfig, useValue: config}]});
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
  max = 10;
  rate = 3;
}
