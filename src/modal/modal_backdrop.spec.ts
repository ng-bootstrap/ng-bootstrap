import {TestBed} from '@angular/core/testing';

import {NgbModalBackdrop} from './modal_backdrop';

describe('ngb-modal-backdrop', () => {

  beforeEach(() => { TestBed.configureTestingModule({declarations: [NgbModalBackdrop]}); });

  it('should render backdrop with required CSS classes', () => {
    const fixture = TestBed.createComponent(NgbModalBackdrop);

    fixture.detectChanges();
    expect(fixture.nativeElement).toHaveCssClass('modal-backdrop');
  });
});
