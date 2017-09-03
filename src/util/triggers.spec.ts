import {By} from '@angular/platform-browser';
import {createGenericTestComponent} from '../test/common';
import {TestComponentRenderer, TestBed, ComponentFixture} from '@angular/core/testing';
import {MockAnimationPlayer} from '@angular/core/testing/mock_animation_player';
import {AnimationKeyframe} from '@angular/core/src/animation/animation_keyframe';
import {AnimationStyles} from '@angular/core/src/animation/animation_styles';
import {AnimationPlayer, Component, Renderer} from '@angular/core';
import {listenToOpenTriggers, parseTriggers} from './triggers';

const createTestComponent =
    (html: string) => <ComponentFixture<TestComponent>>createGenericTestComponent(html, TestComponent);

describe('triggers', () => {

  describe('parseTriggers', () => {

    it('should parse single trigger', () => {
      const t = parseTriggers('foo');

      expect(t.openers.length).toBe(1);
      expect(t.closers.length).toBe(0);
      expect(t.openers[0]).toBe('foo');
    });

    it('should parse open/close form', () => {
      const t = parseTriggers('foo/bar');

      expect(t.openers.length).toBe(1);
      expect(t.closers.length).toBe(1);
      expect(t.openers[0]).toBe('foo');
      expect(t.closers[0]).toBe('bar');
    });

    it('should parse target:event form', () => {
      const t = parseTriggers('foo:bar');

      expect(t.openers.length).toBe(1);
      expect(t.openers[0]).toBe('foo:bar');
    });

    it('should parse multiple triggers', () => {
      const t = parseTriggers('foo:bar bar:baz');

      expect(t.openers.length).toBe(2);
      expect(t.closers.length).toBe(0);
      expect(t.openers[0]).toBe('foo:bar');
      expect(t.openers[1]).toBe('bar:baz');
    });

    it('should parse multiple triggers with mixed forms', () => {
      const t = parseTriggers('foo:bar baz/foo:bar bak');

      expect(t.openers.length).toBe(2);
      expect(t.closers.length).toBe(2);
      expect(t.openers[0]).toBe('foo:bar');
      expect(t.openers[1]).toBe('baz');
      expect(t.closers[0]).toBe('foo:bar');
      expect(t.closers[1]).toBe('bak');
    });

    it('should properly trim excessive white-spaces', () => {
      const t = parseTriggers('foo   bar  \n baz ');

      expect(t.openers.length).toBe(3);
      expect(t.closers.length).toBe(0);
      expect(t.openers[0]).toBe('foo');
      expect(t.openers[1]).toBe('bar');
      expect(t.openers[2]).toBe('baz');
    });

    it('should lookup and translate special aliases', () => {
      const t = parseTriggers('hover');

      expect(t.openers[0]).toBe('mouseenter');
      expect(t.closers[0]).toBe('mouseleave');
    });

    it('should detect manual triggers', () => {
      const t = parseTriggers('manual');

      expect(t.isManual).toBeTruthy();
    });

    it('should ignore empty inputs', () => {
      expect(parseTriggers(null)).toBe(null);
      expect(parseTriggers(undefined)).toBe(null);
      expect(parseTriggers('')).toBe(null);
    });

    it('should throw when more than one manual trigger detected', () => {
      expect(() => {
        parseTriggers('manual click manual');
      }).toThrow('Triggers parse error: only one manual trigger is allowed');
    });

    it('should throw when manual trigger is mixed with other triggers', () => {
      expect(() => {
        parseTriggers('click manual');
      }).toThrow(`Triggers parse error: manual trigger can\'t be mixed with other triggers`);
    });

  });
});

describe('listeners', () => {
  beforeEach(() => { TestBed.configureTestingModule({declarations: [TestComponent]}); });

  it('should call renderer.listen() once on normal trigger', () => {
    let fixture = createTestComponent('<button class="outside">outside</button><button class="test">test</button>');
    let comp: TestComponent = fixture.componentInstance;
    let testBtn = fixture.debugElement.query(By.css('.test'));
    // let outsideBtn = fixture.debugElement.query(By.css('.outside'));

    let onListenSpy = spyOn(comp.renderer, 'listen');
    let onListenGlobalSpy = spyOn(comp.renderer, 'listenGlobal');

    listenToOpenTriggers(comp.renderer, testBtn.nativeElement, 'click/click', comp.open, comp.toggle);

    expect(onListenSpy).toHaveBeenCalled();
    expect(onListenGlobalSpy).not.toHaveBeenCalled();
  });

  it('should call renderer.listen() multiple times on multiple trigger', () => {
    let fixture = createTestComponent('<button class="outside">outside</button><button class="test">test</button>');
    let comp: TestComponent = fixture.componentInstance;
    let testBtn = fixture.debugElement.query(By.css('.test'));

    let onListenSpy = spyOn(comp.renderer, 'listen');
    let onListenGlobalSpy = spyOn(comp.renderer, 'listenGlobal');

    listenToOpenTriggers(comp.renderer, testBtn.nativeElement, 'mouseenter click focus/click', comp.open, comp.toggle);

    expect(onListenSpy).toHaveBeenCalledTimes(3);
    expect(onListenGlobalSpy).not.toHaveBeenCalled();
  });

  it('should call renderer.listenGlobal() once on global trigger', () => {
    let fixture = createTestComponent('<button class="outside">outside</button><button class="test">test</button>');
    let comp: TestComponent = fixture.componentInstance;
    let testBtn = fixture.debugElement.query(By.css('.test'));

    let onListenSpy = spyOn(comp.renderer, 'listen');
    let onListenGlobalSpy = spyOn(comp.renderer, 'listenGlobal');

    listenToOpenTriggers(comp.renderer, testBtn.nativeElement, 'document:click', comp.open, comp.toggle);

    expect(onListenSpy).not.toHaveBeenCalled();
    expect(onListenGlobalSpy).toHaveBeenCalled();
  });
});

@Component({selector: 'test-cmp', template: ``})
export class TestComponent {
  constructor(public renderer: Renderer) {}
  open() {}
  close() {}
  toggle() {}
}
