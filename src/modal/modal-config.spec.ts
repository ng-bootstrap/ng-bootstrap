import {inject} from '@angular/core/testing';

import {NgbModalConfig} from './modal-config';

describe('NgbModalConfig', () => {

  it('should have sensible default values', inject([NgbModalConfig], (config: NgbModalConfig) => {

       expect(config.ariaLabelledBy).toBeUndefined();
       expect(config.backdrop).toBe(true);
       expect(config.backdropClass).toBeUndefined();
       expect(config.beforeDismiss).toBeUndefined();
       expect(config.centered).toBeUndefined();
       expect(config.container).toBeUndefined();
       expect(config.injector).toBeUndefined();
       expect(config.keyboard).toBe(true);
       expect(config.scrollable).toBeUndefined();
       expect(config.size).toBeUndefined();
       expect(config.windowClass).toBeUndefined();
     }));
});
