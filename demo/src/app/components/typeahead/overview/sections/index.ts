import { NgbdTypeaheadOverviewSectionIntroductionComponent } from './introduction';
import { NgbdTypeaheadOverviewSectionBasicUsageComponent } from './basic-usage';
import { NgbdTypeaheadOverviewSectionContractComponent } from './observable-contract';
import { NgbdTypeaheadOverviewSectionUserInteractionComponent } from './user-interaction';
import { NgbdTypeaheadOverviewSectionCustomizeOptionInInputComponent } from './customize-option-in-input';
import { NgbdTypeaheadOverviewSectionCustomizeOptionsListComponent } from './customize-options-list';


export * from './introduction';
export * from './basic-usage';
export * from './observable-contract';
export * from './user-interaction';
export * from './customize-option-in-input';
export * from './customize-options-list';

export const SECTIONS = [
  NgbdTypeaheadOverviewSectionIntroductionComponent,
  NgbdTypeaheadOverviewSectionBasicUsageComponent,
  NgbdTypeaheadOverviewSectionContractComponent,
  NgbdTypeaheadOverviewSectionUserInteractionComponent,
  NgbdTypeaheadOverviewSectionCustomizeOptionInInputComponent,
  NgbdTypeaheadOverviewSectionCustomizeOptionsListComponent,
];

export const SECTIONS_MAP = {
  'basic-usage': 'Basic usage',
  'observable-contract': 'Why the Observable?',
  'user-interaction': 'User interaction',
  'customize-options-list': 'Customize the options list display',
  'customize-option-in-input': 'Format the option in the input',
};
