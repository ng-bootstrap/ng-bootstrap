import {Component, Injectable} from '@angular/core';

@Component({})
export class NoParameterComponent {}

@Component({})
export class ParameterComponent<C> {}

@Injectable()
export interface NoParameterInterface {}

@Injectable()
export interface ParameterInterface<I = NoParameterInterface> {}

@Injectable()
export class NoParameterService {}

@Injectable()
export class ParameterService<S = number> {}
