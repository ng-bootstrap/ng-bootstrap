import {Component} from '@angular/core';
import {DEMO_SNIPPETS} from './demos';
import {NgbdOverview} from '../shared/overview';

@Component({
  selector: 'ngbd-datepicker',
  template: `
    <ngbd-component-wrapper component="Datepicker" [sections]="overview.sections">
      <ngbd-datepicker-overview ngbdOverview [sections]="overview.sections"></ngbd-datepicker-overview>
      <ngbd-api-docs directive="NgbDatepicker"></ngbd-api-docs>
      <ngbd-api-docs directive="NgbInputDatepicker"></ngbd-api-docs>
      <ngbd-api-docs directive="NgbDatepickerToggle"></ngbd-api-docs>
      <ngbd-api-docs-class type="NgbDateStruct"></ngbd-api-docs-class>
      <ngbd-api-docs-class type="NgbDate"></ngbd-api-docs-class>
      <ngbd-api-docs-class type="DayTemplateContext"></ngbd-api-docs-class>
      <ngbd-api-docs-class type="NgbDatepickerNavigateEvent"></ngbd-api-docs-class>
      <ngbd-api-docs-class type="NgbDatepickerI18n"></ngbd-api-docs-class>
      <ngbd-api-docs-class type="NgbCalendar"></ngbd-api-docs-class>
      <ngbd-api-docs-class type="NgbDateParserFormatter"></ngbd-api-docs-class>
      <ngbd-api-docs-class type="NgbDateAdapter"></ngbd-api-docs-class>
      <ngbd-api-docs-config type="NgbDatepickerConfig"></ngbd-api-docs-config>
      <ngbd-example-box demoTitle="Basic datepicker" [snippets]="snippets" component="datepicker" demo="basic">
        <ngbd-datepicker-basic></ngbd-datepicker-basic>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Datepicker in a popup" [snippets]="snippets" component="datepicker" demo="popup">
        <ngbd-datepicker-popup></ngbd-datepicker-popup>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Multiple months" [snippets]="snippets" component="datepicker" demo="multiple">
        <ngbd-datepicker-multiple></ngbd-datepicker-multiple>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Range selection" [snippets]="snippets" component="datepicker" demo="range">
        <ngbd-datepicker-range></ngbd-datepicker-range>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Disabled datepicker" [snippets]="snippets" component="datepicker" demo="disabled">
        <ngbd-datepicker-disabled></ngbd-datepicker-disabled>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Custom date adapter" [snippets]="snippets" component="datepicker" demo="adapter">
        <ngbd-datepicker-adapter></ngbd-datepicker-adapter>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Internationalization of datepickers" [snippets]="snippets" component="datepicker" demo="i18n">
        <ngbd-datepicker-i18n></ngbd-datepicker-i18n>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Custom day view" [snippets]="snippets" component="datepicker" demo="customday">
        <ngbd-datepicker-customday></ngbd-datepicker-customday>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Alternative calendars" [snippets]="snippets" component="datepicker" demo="calendars">
        <ngbd-datepicker-calendars></ngbd-datepicker-calendars>
      </ngbd-example-box>
      <ngbd-example-box demoTitle="Global configuration of datepickers" [snippets]="snippets" component="datepicker" demo="config">
        <ngbd-datepicker-config></ngbd-datepicker-config>
      </ngbd-example-box>
    </ngbd-component-wrapper>
  `
})
export class NgbdDatepicker {
   snippets = DEMO_SNIPPETS;

   overview: NgbdOverview = {
     sections: {
       basic: {
         title: 'Basic Usage',
         fragment: 'basic-usage'
       },
       gettingDate: {
         title: 'Getting/setting a date',
         fragment: 'getting-date'
       },
       model: {
         title: 'Date model and format',
         fragment: 'date-model'
       },
       navigation: {
         title: 'Moving around',
         fragment: 'navigation'
       },
       disabling: {
         title: 'Disabling and limiting dates',
         fragment: 'limiting-dates'
       },
       customization: {
         title: 'Day display customization',
         fragment: 'day-template'
       },
       range: {
         title: 'Range selection',
         fragment: 'range'
       },
       calendars: {
         title: 'Alternative calendars',
         fragment: 'calendars'
       },
       i18n: {
         title: 'Internationalization',
         fragment: 'i18n'
       },
       shortcuts: {
         title: 'Keyboard shortcuts',
         fragment: 'keyboard-shortcuts'
       }
     }
   };
}
