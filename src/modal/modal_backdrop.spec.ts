import {inject, async, addProviders} from '@angular/core/testing';
import {TestComponentBuilder} from '@angular/compiler/testing';

import {addMatchers} from '../util/matchers';

import {NgbModalBackdrop} from './modal_backdrop';

describe('ngb-modal-backdrop', () => {
  beforeEach(() => addMatchers());

  it('should render backdrop with required CSS classes', async(inject([TestComponentBuilder], (tcb) => {
       tcb.createAsync(NgbModalBackdrop).then((fixture) => {
         fixture.detectChanges();

         expect(fixture.nativeElement).toHaveCssClass('modal-backdrop');
       });
     })));
});
