import { Component, ChangeDetectionStrategy } from '@angular/core';
import {
	NgbNavContent,
	NgbNav,
	NgbNavItem,
	NgbNavLink,
	NgbNavLinkButton,
	NgbNavLinkBase,
	NgbNavOutlet,
} from '@ng-bootstrap/ng-bootstrap/nav';

@Component({
	selector: 'ngbd-nav-markup',
	imports: [NgbNavContent, NgbNav, NgbNavItem, NgbNavLink, NgbNavLinkButton, NgbNavLinkBase, NgbNavOutlet],
	changeDetection: ChangeDetectionStrategy.Eager,
	templateUrl: './nav-markup.html',
})
export class NgbdNavMarkup {}
