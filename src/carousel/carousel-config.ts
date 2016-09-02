import {Injectable} from '@angular/core';

/**
 * Configuration service for the NgbCarousel component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the carousels used in the application.
 */
@Injectable()
export class NgbCarouselConfig {
  interval = 5000;
  wrap = true;
  keyboard = true;
}
