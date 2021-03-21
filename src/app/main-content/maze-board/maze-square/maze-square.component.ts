import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, NgZone, OnInit} from '@angular/core';
import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';
import {MouseEventService} from '../mouse-event.service';
import {fromEvent} from 'rxjs';

@Component({
  selector: 'app-maze-square',
  templateUrl: './maze-square.component.html',
  styleUrls: ['./maze-square.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
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
      transition('* => wall', [
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
      ])
    ])
  ]
})
export class MazeSquareComponent implements OnInit {

  @Input() state;


  constructor(private mouseEvent: MouseEventService, private zone: NgZone, private thisElement: ElementRef, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      const enter$ = fromEvent(this.thisElement.nativeElement, 'mouseenter');
      const down$ = fromEvent(this.thisElement.nativeElement, 'mousedown');

      enter$.subscribe((e: MouseEvent) => {
        e.preventDefault();
        if (this.mouseEvent.mouseState === 'btnPressed') {
          this.changeSquareView();
        }
      });

      down$.subscribe((e: MouseEvent) => {
        e.preventDefault();
        this.mouseEvent.mouseState = 'btnPressed';
        this.changeSquareView();
      });
    });

  }

  changeSquareView() {
    this.state = this.state === 'wall' ? 'empty' : 'wall';
    this.cd.detectChanges();
  }

}
