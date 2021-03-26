import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  NgZone,
  OnInit,
  Output
} from '@angular/core';
import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';
import {MouseEventService, MouseState} from '../mouse-event.service';
import {fromEvent} from 'rxjs';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

export enum SquareState {
  start = 'start',
  finish = 'finish',
  passed = 'passed',
  wall = 'wall',
  empty = 'empty',
  optimalPath = 'optimalPath',
  inProcess = 'inProcess'
}


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
  ]
})
export class MazeSquareComponent implements OnInit {

  @Input() state: any;
  @Output() stateChange: EventEmitter<any> = new EventEmitter<any>();


  constructor(private mouseEvent: MouseEventService, private zone: NgZone, private thisElement: ElementRef, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      const enter$ = fromEvent(this.thisElement.nativeElement, 'mouseenter');
      const leave$ = fromEvent(this.thisElement.nativeElement, 'mouseleave');
      const down$ = fromEvent(this.thisElement.nativeElement, 'mousedown');

      enter$.subscribe((e: MouseEvent) => {
        e.preventDefault();
        if (this.mouseEvent.mouseState === MouseState.btnPressed) {
          if (this.state === SquareState.start || this.state === SquareState.finish) {
            return;
          }
          this.state = this.state === SquareState.wall ? SquareState.empty : SquareState.wall;
        } else if (this.mouseEvent.mouseState === MouseState.dragStartBadge) {
          this.state = SquareState.start;
        } else if (this.mouseEvent.mouseState === MouseState.dragFinishBadge) {
          this.state = SquareState.finish;
        }
        this.stateChange.emit(this.state);
        this.cd.detectChanges();
      });

      leave$.subscribe((e: MouseEvent) => {
        e.preventDefault();
        if ((this.mouseEvent.mouseState === MouseState.dragStartBadge ||
        this.mouseEvent.mouseState === MouseState.dragFinishBadge) &&
          (this.state === SquareState.start || this.state === SquareState.finish)) {
          this.state = SquareState.empty;
          this.stateChange.emit(this.state);
          this.cd.detectChanges();
        }
      });

      down$.subscribe((e: MouseEvent) => {
        e.preventDefault();
        if (this.state === SquareState.start) {
          this.mouseEvent.mouseState = MouseState.dragStartBadge;
        } else if (this.state === SquareState.finish) {
          this.mouseEvent.mouseState = MouseState.dragFinishBadge;
        } else {
          this.mouseEvent.mouseState = MouseState.btnPressed;
          this.state = this.state === SquareState.wall ? SquareState.empty : SquareState.wall;
          this.stateChange.emit(this.state);
          this.cd.detectChanges();
        }
      });
    });

  }

}
