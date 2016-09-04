import {fakeAsync, tick, TestBed, ComponentFixture, inject} from '@angular/core/testing';
import {createGenericTestComponent} from '../test/common';

import {Component} from '@angular/core';

import {NgbAlertModule} from './alert.module';
import {NgbAlert, NgbSelfClosingAlert} from './alert';
import {NgbAlertConfig, NgbSelfClosingAlertConfig} from './alert-config';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;

function getAlertElement(element: HTMLElement): HTMLDivElement {
  return <HTMLDivElement>element.querySelector('.alert');
}

function getCloseButton(element: HTMLElement): HTMLButtonElement {
  return <HTMLButtonElement>element.querySelector('button');
}

describe('ngb-alert', () => {

  beforeEach(() => { TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbAlertModule]}); });

  it('should initialize inputs with default values', () => {
    const defaultConfig = new NgbAlertConfig();
    const alertCmp = new NgbAlert(new NgbAlertConfig());

    expect(alertCmp.dismissible).toBe(defaultConfig.dismissible);
    expect(alertCmp.type).toBe(defaultConfig.type);
  });

  it('should allow specifying alert type', () => {
    const fixture = createTestComponent('<ngb-alert type="success">Cool!</ngb-alert>');
    const alertEl = getAlertElement(fixture.nativeElement);

    expect(alertEl.getAttribute('role')).toEqual('alert');
    expect(alertEl).toHaveCssClass('alert-success');
  });

  it('should render close button when dismissible', () => {
    const fixture = createTestComponent('<ngb-alert [dismissible]="true">Watch out!</ngb-alert>');

    expect(getCloseButton(getAlertElement(fixture.nativeElement))).toBeTruthy();
  });

  it('should render close button only if dismissible', () => {
    const fixture = createTestComponent(`<ngb-alert [dismissible]="false">Don't close!</ngb-alert>`);
    expect(getCloseButton(getAlertElement(fixture.nativeElement))).toBeFalsy();
  });

  describe('Custom config', () => {
    let config: NgbAlertConfig;

    beforeEach(() => { TestBed.configureTestingModule({imports: [NgbAlertModule]}); });

    beforeEach(inject([NgbAlertConfig], (c: NgbAlertConfig) => {
      config = c;
      config.dismissible = false;
      config.type = 'success';
    }));

    it('should initialize inputs with provided config', () => {
      const fixture = TestBed.createComponent(NgbAlert);
      fixture.detectChanges();

      const alert = fixture.componentInstance;
      expect(alert.dismissible).toBe(config.dismissible);
      expect(alert.type).toBe(config.type);
    });
  });

  describe('Custom config as provider', () => {
    let config = new NgbAlertConfig();
    config.dismissible = false;
    config.type = 'success';

    beforeEach(() => {
      TestBed.configureTestingModule(
          {imports: [NgbAlertModule], providers: [{provide: NgbAlertConfig, useValue: config}]});
    });

    it('should initialize inputs with provided config as provider', () => {
      const fixture = TestBed.createComponent(NgbAlert);
      fixture.detectChanges();

      const alert = fixture.componentInstance;
      expect(alert.dismissible).toBe(config.dismissible);
      expect(alert.type).toBe(config.type);
    });
  });
});

describe('NgbSelfClosingAlert', () => {

  describe('UI logic', () => {
    beforeEach(() => { TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbAlertModule]}); });

    it('should open a self-closing alert with default type and no close button', () => {
      const defaultConfig = new NgbSelfClosingAlertConfig();
      const fixture = createTestComponent(`<template ngbAlert>Hello, {{name}}!</template>`);
      const alertEl = getAlertElement(fixture.nativeElement);

      expect(alertEl).toHaveCssClass(`alert-${defaultConfig.type}`);
      expect(alertEl.getAttribute('role')).toEqual('alert');
      expect(getCloseButton(alertEl)).toBeFalsy();
    });

    it('should open a self-closing alert with a specified type', () => {
      const fixture = createTestComponent(`<template ngbAlert type="success">Hello, {{name}}!</template>`);
      const alertEl = getAlertElement(fixture.nativeElement);

      expect(alertEl).toHaveCssClass('alert-success');
    });

    it('should dismiss alert and invoke close handler on close button click', () => {
      const fixture = createTestComponent(
          `<template ngbAlert (close)="closed = true" [dismissible]="true">Hello, {{name}}!</template>`);
      const alertEl = getAlertElement(fixture.nativeElement);

      getCloseButton(alertEl).click();
      fixture.detectChanges();

      expect(fixture.componentInstance.closed).toBeTruthy();
      expect(getAlertElement(fixture.nativeElement)).toBeNull();
    });

    it('should auto close on timeout specified', fakeAsync(() => {
         const fixture =
             createTestComponent(`<template ngbAlert [dismissOnTimeout]="1000">Hello, {{name}}!</template>`);
         const alertEl = getAlertElement(fixture.nativeElement);

         tick(800);
         fixture.detectChanges();
         expect(alertEl.getAttribute('role')).toEqual('alert');

         tick(1200);
         fixture.detectChanges();
         expect(getAlertElement(fixture.nativeElement)).toBeNull();
       }));
  });

  describe('Custom config', () => {

    let config: NgbSelfClosingAlertConfig;

    beforeEach(() => {
      TestBed.configureTestingModule({declarations: [TestComponent], imports: [NgbAlertModule]});
      TestBed.overrideComponent(TestComponent, {set: {template: '<template ngbAlert>Hello, {{name}}!</template>'}});
      inject([NgbSelfClosingAlertConfig], (c: NgbSelfClosingAlertConfig) => {
        config = c;
        config.dismissible = true;
        config.dismissOnTimeout = 2000;
        config.type = 'success';
      });
    });

    it('should initialize inputs with provided config', () => {
      const fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();

      fakeAsync(() => {
        const alertEl = getAlertElement(fixture.nativeElement);

        expect(alertEl).toHaveCssClass(`alert-${config.type}`);
        expect(getCloseButton(alertEl)).toBeTruthy();

        tick(config.dismissOnTimeout);
        fixture.detectChanges();
        expect(getAlertElement(fixture.nativeElement)).toBeNull();
      });
    });
  });

  describe('Custom config as provider', () => {
    const config = new NgbSelfClosingAlertConfig();
    config.dismissible = true;
    config.dismissOnTimeout = 2000;
    config.type = 'success';

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent],
        imports: [NgbAlertModule],
        providers: [{provide: NgbSelfClosingAlertConfig, useValue: config}]
      });
    });

    it('should initialize inputs with provided config as provider', fakeAsync(() => {
         const fixture = createTestComponent(`<template ngbAlert>Hello, {{name}}!</template>`);
         const alertEl = getAlertElement(fixture.nativeElement);

         expect(alertEl).toHaveCssClass(`alert-${config.type}`);
         expect(getCloseButton(alertEl)).toBeTruthy();

         tick(config.dismissOnTimeout);
         fixture.detectChanges();
         expect(getAlertElement(fixture.nativeElement)).toBeNull();
       }));
  });
});

@Component({selector: 'test-cmp', template: '', entryComponents: [NgbAlert]})
class TestComponent {
  name = 'World';
  closed = false;
}
