import {Component, Directive, Injectable} from '@angular/core';

@Directive({
  selector: '[ngbDirective]'
})
/**
 * Should be 'Directive'
 */
export class NgbDirective {}

@Component({
  selector: 'ngb-component'
})
/**
 * Should be 'Component'
 */
export class NgbComponent {}


@Injectable()
/**
 * Should be 'Service'
 */
export class NgbService {}

/**
 * Should be 'Class'
 */
export class NgbClass {}

/**
 * Should be 'Interface'
 */
export interface NgbInterface {}
