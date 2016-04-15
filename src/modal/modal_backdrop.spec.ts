import {
  iit,
  it,
  ddescribe,
  describe,
  expect,
  inject,
  injectAsync,
  TestComponentBuilder,
  beforeEachProviders
} from 'angular2/testing';

import {NgbModalBackdrop} from './modal_backdrop';

describe('ngb-modal-backdrop', () => {

  it('should render backdrop with required CSS classes', injectAsync([TestComponentBuilder], (tcb) => {
       return tcb.createAsync(NgbModalBackdrop).then((fixture) => {
         fixture.detectChanges();

         expect(fixture.nativeElement).toHaveCssClass('modal-backdrop');
         expect(fixture.nativeElement).toHaveCssClass('fade');
         expect(fixture.nativeElement).toHaveCssClass('in');
       });
     }));
});
