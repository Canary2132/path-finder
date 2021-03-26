import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';

export const SquareAnimation = [
    trigger('square', [
    state('passed', style({
      background: '#61d6ff',
      transform: 'scale(1.0)'
    })),
    transition('* => passed', [
      animate('1.2s', keyframes([
        style({
          background: '#bf72ff',
          transform: 'scale(0.1)',
          borderRadius: '50%',
          offset: 0.1
        }),
        style({
          background: '#fa6d8e',
          transform: 'scale(1)',
          offset: 0.5
        }),
        style({
          background: '#618eff',
          borderRadius: '0',
          offset: 0.7
        }),
        style({
          background: '#61b5ff',
          transform: 'scale(1.3)',
          offset: 0.9
        }),
        style({
          background: '#61d6ff',
          transform: 'scale(1.0)',
          offset: 1
        })
      ]))
    ]),
    state('wall', style({
      background: '#141b56',
    })),
    transition('empty => wall', [
      animate('0.4s', keyframes([
        style({
          background: '#0ff1e9',
          transform: 'scale(0.1)',
          offset: 0.1
        }),
        style({
          background: '#1a2ee9',
          transform: 'scale(1.3)',
          offset: 0.6
        }),
        style({
          background: '#141b56',
          transform: 'scale(1)',
          offset: 0.9
        })
      ]))
    ]),
    transition('wall => empty', [
      animate('0.4s', keyframes([
        style({
          background: '#141b56',
          transform: 'scale(1)',
          offset: 0.1
        }),
        style({
          background: '#1a2ee9',
          transform: 'scale(1.3)',
          offset: 0.6
        }),
        style({
          background: '#0ff1e9',
          transform: 'scale(0.1)',
          offset: 0.9
        })
      ]))
    ]),
    state('optimalPath', style({
      background: '#ffde21',
    })),
    transition('passed => optimalPath', [
      animate('0.4s', keyframes([
        style({
          background: '#fdf678',
          transform: 'scale(0.1)',
          offset: 0.1
        }),
        style({
          background: '#ffa621',
          transform: 'scale(1.3)',
          offset: 0.6
        }),
        style({
          background: '#ffde21',
          transform: 'scale(1)',
          offset: 0.9
        })
      ]))
    ]),
    state('inProcess', style({
      background: '#28ff21',
    })),
  ])
];
