import {Component, Input, forwardRef} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';

const NGB_SELECT_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgbSelect),
  multi: true
};

/**
 * The ngbSelect component is a custom select using the dropdown directives
 */
@Component({
  selector: 'ngb-select',
  exportAs: 'ngbSelect',
  host: {'[class.collapse]': 'true', '[class.in]': '!collapsed', '[attr.aria-expanded]': '!collapsed'},
  template: `
    <div ngbDropdown>
      <span class="form-control" tabindex="0" role="combobox" ngbDropdownToggle>
        <span *ngIf="!model">{{getPlaceholder()}}</span>
        <span *ngIf="model">{{getLabelForModel(model)}}</span>
      </span>
      <div class="dropdown-menu" role="listbox">
        <button role="option" tabindex="-1" class="dropdown-item"
          *ngFor="let option of ngbOptions"
          (click)="selectOption(option)"
          [ngClass]="{active: model === getValue(option)}">
            {{getLabel(option)}}
        </button>
      </div>
    </div>`,
  styles: [`
      .dropdown-menu {
        width: 100%!important;
        overflow-y: auto;
        max-height: 300px;
      }
      .dropdown-toggle:after {
        position: absolute;
        top: 16px;
        right: 16px;
      }
    `],
  providers: [NGB_SELECT_VALUE_ACCESSOR]
})
export class NgbSelect {
  model: any;
  selectedOption: any;

  /**
   * Options for the Select Dropdown with label and value.
   */
  @Input() ngbOptions = [];

  /**
   * Placeholder text for the Select element, if no option is selected.
   */
  @Input() ngbPlaceholder;

  /**
   * Label property name
   */
  @Input() ngbLabel = 'label';

  /**
   * Value property name
   */
  @Input() ngbValue = 'value';

  onChange = (_: any) => {};
  onTouched = () => {};

  registerOnChange(fn: (value: any) => any): void { this.onChange = fn; }

  registerOnTouched(fn: () => any): void { this.onTouched = fn; }

  writeValue(value) { this.model = value ? value : null; }

  selectOption(option) {
    if (typeof option !== 'object') {
      this.model = option;
      this.selectedOption = option;
      this.onTouched();
      this.writeValue(option);
      this.onChange(option);
    } else {
      this.model = option[this.ngbValue];
      this.selectedOption = option;
      this.onTouched();
      this.writeValue(option[this.ngbValue]);
      this.onChange(option[this.ngbValue]);
    }
  }

  getPlaceholder() {
    if (this.selectedOption) {
      if (typeof this.selectedOption !== 'object') {
        return this.selectedOption;
      }
      return this.selectedOption[this.ngbLabel];
    }
    return this.ngbPlaceholder;
  }

  getLabelForModel(model) {
    if (typeof model !== 'object') {
      return this.ngbOptions
          .filter((option) => {
            if (typeof option !== 'object') {
              if (option === model) {
                return this.getLabel(option);
              }
            } else {
              if (option[this.ngbValue] === model) {
                return this.getLabel(option);
              }
            }
          })
          .map((option) => {
            if (typeof option === 'object') {
              return option[this.ngbLabel];
            }
            return option;
          });
    } else {
      return this.getLabel(model);
    }
  }

  getLabel(option): any {
    if (typeof option !== 'object') {
      return option;
    }
    return option[this.ngbLabel];
  }

  getValue(option): any {
    if (typeof option !== 'object') {
      return option;
    }
    return option[this.ngbValue];
  }
}
