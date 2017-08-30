import {animation, style, animate, AnimationReferenceMetadata} from '@angular/animations';

export const fadeIn: AnimationReferenceMetadata =
    animation([style({opacity: 0}), animate('.15s linear', style({opacity: 0.5}))]);

export const fadeOut: AnimationReferenceMetadata =
    animation([style({opacity: 0.5}), animate('.15s linear', style({opacity: 0}))]);
