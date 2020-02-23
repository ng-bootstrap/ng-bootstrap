import { $, $$ } from 'protractor';

export const getLinkElement = (link) => {
  return $(`a[href="#/${link}"]`);
};

export const getComponentTabsLinks = (component) => {
  return $('header.title').$$(`a.nav-link[href^="#/components/${component}"]`);
};

export const getCodeToggleElement = () => {
  return $$(`button.toggle-code`).get(0);
};

export const getCodeElements = () => {
  return $$(`code.language-html`);
};




