import {animation, style, animate, AnimationReferenceMetadata} from '@angular/animations';

export const fadeIn: AnimationReferenceMetadata = animation(
    [style({opacity: 0}), animate('{{ duration }} {{ easing }}', style({opacity: '{{ opacity }}'}))],
    {params: {duration: '.15s', easing: 'linear', opacity: '0.5'}});

export const fadeOut: AnimationReferenceMetadata = animation(
    [style({opacity: '{{ opacity }}'}), animate('{{ duration }} {{ easing }}', style({opacity: 0}))],
    {params: {duration: '.15s', easing: 'linear', opacity: '0.5'}});
