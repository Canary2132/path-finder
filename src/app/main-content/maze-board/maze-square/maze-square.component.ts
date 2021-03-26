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
import {SquareAnimation} from './square-animations';
import {SquareState} from '../../../shared/enums/square-state.enum';


@Component({
  selector: 'app-maze-square',
  templateUrl: './maze-square.component.html',
  styleUrls: ['./maze-square.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: SquareAnimation
})
export class MazeSquareComponent implements OnInit {

  @Input() state: SquareState;
  @Output() stateChange: EventEmitter<SquareState> = new EventEmitter<SquareState>();

  constructor(private mouseEvent: MouseEventService,
              private zone: NgZone,
              private thisElement: ElementRef,
              private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.addListeners();
  }

  private addListeners(): void {
    this.zone.runOutsideAngular(() => {
      fromEvent(this.thisElement.nativeElement, 'mouseenter')
        .subscribe((e: MouseEvent) => this.onMouseEnter(e));
      fromEvent(this.thisElement.nativeElement, 'mouseleave')
        .subscribe((e: MouseEvent) => this.onMouseLeave(e));
      fromEvent(this.thisElement.nativeElement, 'mousedown')
        .subscribe((e: MouseEvent) => this.onMouseDown(e));
    });
  }

  private onMouseEnter(e: MouseEvent): void {
    e.preventDefault();
    if (this.mouseEvent.mouseState === MouseState.btnPressed && !this.isPathMarker) {
      this.changePermeability();
    } else if (this.mouseEvent.mouseState === MouseState.dragStartBadge) {
      this.state = SquareState.start;
    } else if (this.mouseEvent.mouseState === MouseState.dragFinishBadge) {
      this.state = SquareState.finish;
    }
    this.update();
  }

  private onMouseLeave(e: MouseEvent): void {
    e.preventDefault();
    if (this.mouseEvent.isDraggingPathMarker && this.isPathMarker) {
      this.state = SquareState.empty;
      this.update();
    }
  }

  private onMouseDown(e: MouseEvent): void {
    e.preventDefault();
    if (this.state === SquareState.start) {
      this.mouseEvent.mouseState = MouseState.dragStartBadge;
    } else if (this.state === SquareState.finish) {
      this.mouseEvent.mouseState = MouseState.dragFinishBadge;
    } else {
      this.mouseEvent.mouseState = MouseState.btnPressed;
      this.changePermeability();
      this.update();
    }
  }

  private update(): void {
    this.stateChange.emit(this.state);
    this.cd.detectChanges();
  }

  private changePermeability(): void{
    this.state = this.state === SquareState.wall ? SquareState.empty : SquareState.wall;
  }

  private get isPathMarker(): boolean {
    return this.state === SquareState.start || this.state === SquareState.finish;
  }

}
