import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';

const iconAnimation = [
  state('hide', style({
    opacity: 0
  })),
  transition('hide => shown', [
    style({
      transform: 'rotate(-180deg)',
      opacity: 0,
    }),
    animate('0.2s', keyframes([
      style({
        transform: 'rotate(0)',
        opacity: 1,
        offset: 1
      })
    ]))
  ]),
  transition('shown => hide', [
    animate('0.2s', keyframes([
      style({
        transform: 'rotate(180deg)',
        opacity: 0,
        offset: 1
      })
    ]))
  ])
];

export const ChangeThemeIconAnimation = [
  trigger('iconLight', iconAnimation),
  trigger('iconDark', iconAnimation)
];
