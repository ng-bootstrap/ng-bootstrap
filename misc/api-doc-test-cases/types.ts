import { Component, Directive, Service } from '@angular/core';

/**
 * Should be 'Directive'
 */
@Directive({
  selector: '[ngbDirective]'
})
export class NgbDirective {}

/**
 * Should be 'Component'
 */
@Component({
  selector: 'ngb-component'
})
export class NgbComponent {}


/**
 * Should be 'Service'
 */
@Service()
export class NgbService {}

/**
 * Should be 'Class'
 */
export class NgbClass {}

/**
 * Should be 'Interface'
 */
export interface NgbInterface {}
