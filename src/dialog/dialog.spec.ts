import {Component} from "angular2/core";

import {
  iit,
  it,
  ddescribe,
  describe,
  expect,
  inject,
  injectAsync,
  TestComponentBuilder,
  beforeEach,
  beforeEachProviders
} from 'angular2/testing';


import {NgbDialog, NgbDialogOpenResult} from './dialog';

describe('NgbDialog', () => {

  beforeEachProviders(() => [NgbDialog]);

  it('should open a component into a container',
     injectAsync(
         [NgbDialog], (ngbDialog: NgbDialog) => {

                          return ngbDialog.open([TestComponent]).then((result: NgbDialogOpenResult) => {
                            expect(result.componentRefs.length).toBe(1);
                            expect(result.componentRefs[0].componentType).toBe(TestComponent);
                            expect(result.componentRefs[0].location.nativeElement).toHaveText('Test content');

                            result.disposeAll();
                          })}));

  it('should open multiple components into a container',
     injectAsync(
         [NgbDialog], (ngbDialog: NgbDialog) => {

                          return ngbDialog.open([TestComponent, OtherComponent]).then((result: NgbDialogOpenResult) => {
                            expect(result.componentRefs.length).toBe(2);
                            expect(result.componentRefs[0].componentType).toBe(TestComponent);
                            expect(result.componentRefs[1].componentType).toBe(OtherComponent);
                            expect(result.componentRefs[0].location.nativeElement).toHaveText('Test content');
                            expect(result.componentRefs[1].location.nativeElement).toHaveText('Other content');

                            result.disposeAll();
                          })}));

});

@Component({selector: 'test-component', template: `Test content`})
export class TestComponent {
}

@Component({selector: 'other-component', template: `Other content`})
export class OtherComponent {
}
