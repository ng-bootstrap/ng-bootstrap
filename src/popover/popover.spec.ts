import {iit, it, ddescribe, describe, expect, inject, async} from '@angular/core/testing';
import {TestComponentBuilder} from '@angular/compiler/testing';

import {NgbPopoverWindow} from './popover';

describe('ngb-popover-window', () => {

  it('should render popover on top by default', async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
       tcb.createAsync(NgbPopoverWindow).then((fixture) => {
         fixture.componentInstance.title = 'Test title';
         fixture.detectChanges();

         expect(fixture.nativeElement).toHaveCssClass('popover');
         expect(fixture.nativeElement).toHaveCssClass('top');
         expect(fixture.nativeElement.getAttribute('role')).toBe('tooltip');
         expect(fixture.nativeElement.querySelector('.popover-title').textContent).toBe('Test title');
       });
     })));

  it('should position popovers as requested', async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
       tcb.createAsync(NgbPopoverWindow).then((fixture) => {
         fixture.componentInstance.placement = 'left';
         fixture.detectChanges();
         expect(fixture.nativeElement).toHaveCssClass('left');
       });
     })));
});
