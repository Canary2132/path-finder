import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone, OnInit, Output} from '@angular/core';
import {MouseEventService, MouseState} from '../services/mouse-event.service';
import {fromEvent} from 'rxjs';
import {SquareAnimation} from './square-animations';
import {VertexState} from '../../../shared/enums/vertex-state.enum';
import {PathMarkersService} from '../services/path-markers.service';
import {Vertex} from '../../../shared/interfaces/vertex';


const DIRTY_STATES = [VertexState.visited, VertexState.optimalPath, VertexState.inProcess];

@Component({
  selector: 'app-maze-square',
  templateUrl: './maze-square.component.html',
  styleUrls: ['./maze-square.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: SquareAnimation
})
export class MazeSquareComponent implements Vertex, OnInit {

  boardRow: number;
  boardCol: number;

  private _state: VertexState = VertexState.empty;

  constructor(private mouseEvent: MouseEventService,
              private zone: NgZone,
              private thisElement: ElementRef,
              public cd: ChangeDetectorRef,
              private pathMarkers: PathMarkersService) { }

  ngOnInit(): void {
    this.addListeners();
  }

  private addListeners(): void {
    this.zone.runOutsideAngular(() => {
      fromEvent(this.thisElement.nativeElement, 'mouseenter')
        .subscribe((e: MouseEvent) => this.onMouseEnter(e));

      fromEvent(this.thisElement.nativeElement, 'mousedown')
        .subscribe((e: MouseEvent) => this.onMouseDown(e));
    });
  }

  private onMouseEnter(e: MouseEvent): void {
    e.preventDefault();
    if (this.isPathMarker) return;

    if (this.mouseEvent.mouseState === MouseState.btnPressed) {
      this.changePermeability();
      this.cd.detectChanges();
    } else if (this.mouseEvent.mouseState === MouseState.dragStartBadge) {
      this.pathMarkers.newStart = this;
      this.cd.detectChanges();
    } else if (this.mouseEvent.mouseState === MouseState.dragFinishBadge) {
      this.pathMarkers.newFinish = this;
      this.cd.detectChanges();
    }
  }

  private onMouseDown(e: MouseEvent): void {
    e.preventDefault();
    if (this._state === VertexState.start) {
      this.mouseEvent.mouseState = MouseState.dragStartBadge;
    } else if (this._state === VertexState.finish) {
      this.mouseEvent.mouseState = MouseState.dragFinishBadge;
    } else {
      this.mouseEvent.mouseState = MouseState.btnPressed;
      this.changePermeability();
    }
  }

  clearDirty(): void {
    if (DIRTY_STATES.includes(this._state)) {
      this.state = VertexState.empty;
    }
  }

  clearNonPathMarkers(): void {
    if (!this.isPathMarker) {
      this.state = VertexState.empty;
    }
  }

  get state(): VertexState {
    return this._state;
  }

  set state(value: VertexState) {
    this._state = value;
    this.cd.detectChanges();
  }

  private changePermeability(): void{
    this._state = this._state === VertexState.wall ? VertexState.empty : VertexState.wall;
    this.cd.detectChanges();
  }

  get isPathMarker(): boolean {
    return this._state === VertexState.start || this._state === VertexState.finish;
  }

}
