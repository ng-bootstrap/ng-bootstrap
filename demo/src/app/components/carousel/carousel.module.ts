import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NgbdSharedModule } from '../../shared';
import { ComponentWrapper } from '../../shared/component-wrapper/component.component';
import { NgbdComponentsSharedModule } from '../shared';
import { getApis, NgbdApiPage } from '../shared/api-page/api.component';
import { NgbdExamplesPage } from '../shared/examples-page/examples.component';
import { NgbdCarouselBasic } from './demos/basic/carousel-basic';
import { NgbdCarouselConfig } from './demos/config/carousel-config';
import { NgbdCarouselNavigation } from './demos/navigation/carousel-navigation';


const DEMO_DIRECTIVES = [NgbdCarouselBasic, NgbdCarouselConfig, NgbdCarouselNavigation];

const demos = {
  basic: {
    title: 'Carousel',
    type: NgbdCarouselBasic,
    code: require('!!raw-loader!./demos/basic/carousel-basic'),
    markup: require('!!raw-loader!./demos/basic/carousel-basic.html')
  },
  navigation: {
    title: 'Navigation arrows and indicators',
    type: NgbdCarouselNavigation,
    code: require('!!raw-loader!./demos/navigation/carousel-navigation'),
    markup: require('!!raw-loader!./demos/navigation/carousel-navigation.html')
  },
  config: {
    title: 'Global configuration of carousels',
    type: NgbdCarouselConfig,
    code: require('!!raw-loader!./demos/config/carousel-config'),
    markup: require('!!raw-loader!./demos/config/carousel-config.html')
  }
};

const apis = getApis('carousel');

const ROUTES = [
  { path: '', pathMatch: 'full', redirectTo: 'examples' },
  { path: '',
    component: ComponentWrapper,
    data: { demos, apis },
    children: [
      { path: 'examples', component: NgbdExamplesPage },
      { path: 'api', component: NgbdApiPage }
    ]
  }
]

@NgModule({
  imports: [NgbdSharedModule, NgbdComponentsSharedModule, RouterModule.forChild(ROUTES)],
  exports: [RouterModule],
  declarations: DEMO_DIRECTIVES,
  entryComponents: DEMO_DIRECTIVES
})
export class NgbdCarouselModule {}
