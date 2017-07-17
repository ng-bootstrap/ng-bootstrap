import {TestBed, ComponentFixture} from '@angular/core/testing';
import {NgbButtonsModule} from './radio.module';
import {FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators} from '@angular/forms';
import {Component} from '@angular/core';
import {createGenericTestComponent} from '../test/common';

const createTestComponent = (html: string) =>
    createGenericTestComponent(html, TestComponent) as ComponentFixture<TestComponent>;


describe('NgbActiveLabel', () => {
  beforeEach(() => {
    TestBed.configureTestingModule(
        {declarations: [TestComponent], imports: [NgbButtonsModule, FormsModule, ReactiveFormsModule]});
  });

  it('should not touch active class on labels not part of a group', () => {
    const fixture = createTestComponent('<label class="btn" [class.active]="true"></label>');
    expect(fixture.nativeElement.children[0]).toHaveCssClass('active');
  });
});

@Component({selector: 'test-cmp', template: ''})
class TestComponent {
  form = new FormGroup({control: new FormControl('', Validators.required)});
}
