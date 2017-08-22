import {TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {NgbModalBackdrop} from './modal-backdrop';

describe('ngb-modal-backdrop', () => {

  beforeEach(
      () => { TestBed.configureTestingModule({declarations: [NgbModalBackdrop], imports: [NoopAnimationsModule]}); });

  it('should render backdrop with required CSS classes', () => {
    const fixture = TestBed.createComponent(NgbModalBackdrop);

    fixture.detectChanges();
    expect(fixture.nativeElement).toHaveCssClass('modal-backdrop');
  });
});
