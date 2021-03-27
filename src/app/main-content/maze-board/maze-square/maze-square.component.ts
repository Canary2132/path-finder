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
import {VertexState} from '../../../shared/enums/vertex-state.enum';


@Component({
  selector: 'app-maze-square',
  templateUrl: './maze-square.component.html',
  styleUrls: ['./maze-square.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: SquareAnimation
})
export class MazeSquareComponent implements OnInit {

  @Input() state: VertexState;
  @Output() stateChange: EventEmitter<VertexState> = new EventEmitter<VertexState>();

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
      this.state = VertexState.start;
    } else if (this.mouseEvent.mouseState === MouseState.dragFinishBadge) {
      this.state = VertexState.finish;
    }
    this.update();
  }

  private onMouseLeave(e: MouseEvent): void {
    e.preventDefault();
    if (this.mouseEvent.isDraggingPathMarker && this.isPathMarker) {
      this.state = VertexState.empty;
      this.update();
    }
  }

  private onMouseDown(e: MouseEvent): void {
    e.preventDefault();
    if (this.state === VertexState.start) {
      this.mouseEvent.mouseState = MouseState.dragStartBadge;
    } else if (this.state === VertexState.finish) {
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
    this.state = this.state === VertexState.wall ? VertexState.empty : VertexState.wall;
  }

  private get isPathMarker(): boolean {
    return this.state === VertexState.start || this.state === VertexState.finish;
  }

}
