import {Directive, EventEmitter, Input, Output, HostBinding, HostListener} from '@angular/core';
import {Country} from './country';

export type SortColumn = keyof Country | '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: {[key: string]: SortDirection} = { 'asc': 'desc', 'desc': '', '': 'asc' };

export interface SortEvent {
  column: SortColumn;
  direction: SortDirection;
}

@Directive({
  selector: 'th[sortable]',
})
export class NgbdSortableHeader {

  @Input() sortable: SortColumn = '';
  @Input() direction: SortDirection = '';
  @Output() sort = new EventEmitter<SortEvent>();
  @HostBinding('class.asc') get asc() {
    return this.direction === 'asc';
  }
  @HostBinding('class.desc') get desc() {
    return this.direction === 'desc';
  }
  @HostListener('click') rotate() {
    {
      this.direction = rotate[this.direction];
      this.sort.emit({column: this.sortable, direction: this.direction});
    }
  }
}
