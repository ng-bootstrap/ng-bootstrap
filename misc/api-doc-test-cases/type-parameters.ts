import { Component, Injectable } from '@angular/core';

/**
 * Component doc
 */
@Component({})
export class NoParameterComponent {}

/**
 * Component doc
 */
@Component({})
export class ParameterComponent<C> {}

/**
 * Interface doc
 */
@Injectable()
export interface NoParameterInterface {}

/**
 * Interface doc
 */
@Injectable()
export interface ParameterInterface<I = NoParameterInterface> {}

/**
 * Service doc
 */
@Injectable()
export class NoParameterService {}

/**
 * Service doc
 */
@Injectable()
export class ParameterService<S = number> {}
