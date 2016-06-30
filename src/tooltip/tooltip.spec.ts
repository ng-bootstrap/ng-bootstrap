import {inject, async} from '@angular/core/testing';
import {TestComponentBuilder} from '@angular/compiler/testing';

import {NgbTooltipWindow} from './tooltip';

describe('ngb-tooltip-window', () => {
  it('should render tooltip on top by default', async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
       tcb.createAsync(NgbTooltipWindow).then((fixture) => {
         fixture.detectChanges();

         expect(fixture.nativeElement).toHaveCssClass('tooltip');
         expect(fixture.nativeElement).toHaveCssClass('top');
         expect(fixture.nativeElement.getAttribute('role')).toBe('tooltip');
       });
     })));

  it('should position tooltips as requested', async(inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
       tcb.createAsync(NgbTooltipWindow).then((fixture) => {
         fixture.componentInstance.placement = 'left';
         fixture.detectChanges();
         expect(fixture.nativeElement).toHaveCssClass('left');
       });
     })));
});
