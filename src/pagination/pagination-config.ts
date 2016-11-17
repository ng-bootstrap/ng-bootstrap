import {Injectable} from '@angular/core';

/**
 * Configuration service for the NgbPagination component.
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the paginations used in the application.
 */
@Injectable()
export class NgbPaginationConfig {
  boundaryLinks = false;
  directionLinks = true;
  ellipses = true;
  firstText = '««';
  lastText = '»»';
  maxSize = 0;
  nextText = '»';
  pageSize = 10;
  previousText = '«';
  rotate = false;
  size: 'sm' | 'lg';
}
