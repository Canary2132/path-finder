import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef, EventEmitter, NgZone,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {concat, from, fromEvent, of, Subscription} from 'rxjs';
import {MouseEventService, MouseState} from './services/mouse-event.service';
import {MazeSquareComponent} from './maze-square/maze-square.component';
import {GraphCreator} from '../../shared/graph-creator';
import {delayTimer} from '../../shared/helper';
import {VertexState} from '../../shared/enums/vertex-state.enum';
import {Vertex} from '../../shared/interfaces/vertex';
import {concatMap, delay, filter, last, takeLast} from 'rxjs/operators';
import {DijkstraAlgorithm} from '../algorithms/dijkstra';
import {CompletedEvent, UpdateVertexEvent} from '../../shared/interfaces/algorithm-event';
import {PathMarkersService} from './services/path-markers.service';
import {ToastService} from '../../shared/components/toast/toast.service';
import {ControlActionEventClear, ControlActionEventsRun} from '../../shared/interfaces/control-action-events';
import {AStar} from '../algorithms/a-star';
import {PathFindAlgorithm} from '../../shared/enums/path-find-algorithm.enum';

@Component({
  selector: 'app-maze-board',
  templateUrl: './maze-board.component.html',
  styleUrls: ['./maze-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MazeBoardComponent implements OnInit, AfterViewInit {

  @ViewChildren('vertices') vertices: QueryList<MazeSquareComponent>;

  rowsAmount = 30;
  colsAmount = 50;

  private graph: Map<Vertex, Set<Vertex>>;

  private paintQueue$;
  private paintQueue = [];

  isPainting = false;

  private algorithmEvents$;

  constructor(private mouseEvent: MouseEventService,
              private cd: ChangeDetectorRef,
              private pathMarkers: PathMarkersService,
              private zone: NgZone,
              private toast: ToastService) { }

  ngOnInit(): void {
    this.addMouseEvents();
  }

  ngAfterViewInit(): void {
    this.setVertexData();
    this.setDefaultPath();
  }

  handleControlActions(event: ControlActionEventsRun | ControlActionEventClear): void {
    switch (event.type) {
      case 'findPath': {
        this.runAlgorithm(event.algorithmName);
        break;
      }
      case 'clear': {
        this.clear(event.clearObject);
        break;
      }
    }
  }

  private setVertexData(): void {
    this.vertices.toArray().forEach((vertex, i) => {
      vertex.boardRow = Math.floor(i / this.colsAmount);
      vertex.boardCol = i % this.colsAmount;
    });
  }

  private setDefaultPath(): void {
    const row = Math.floor(this.rowsAmount * 0.45);
    const starIndex = Math.floor(row * this.colsAmount + this.colsAmount * 0.3);
    const finishIndex = Math.floor(row * this.colsAmount + this.colsAmount * 0.7);
    this.pathMarkers.newStart = this.vertices.toArray()[starIndex];
    this.pathMarkers.newFinish = this.vertices.toArray()[finishIndex];
  }

  private addMouseEvents(): void {
    fromEvent(document, 'mouseup').subscribe((e: MouseEvent) => {
      e.preventDefault();
      this.mouseEvent.mouseState = MouseState.btnReleased;
    });
  }

  private runAlgorithm(name: PathFindAlgorithm): void {
    this.clear('path');

    switch (name) {
      case PathFindAlgorithm.AStar: {
        this.runAStar();
        break;
      }
      case PathFindAlgorithm.Dijkstra: {
        this.runDijkstra();
        break;
      }
    }
  }

  private runDijkstra(): void {
    this.graph = GraphCreator.fromBoard(this.vertices.toArray(), this.rowsAmount, this.colsAmount);
    this.handleAlgorithmEvents(DijkstraAlgorithm.event);
    DijkstraAlgorithm.run(this.graph);
  }

  private runAStar(): void {
    this.graph = GraphCreator.fromBoard(this.vertices.toArray(), this.rowsAmount, this.colsAmount);
    this.handleAlgorithmEvents(AStar.event);
    AStar.run(this.graph, this.pathMarkers.startMarker, this.pathMarkers.finishMarker);
  }

  private handleAlgorithmEvents(algorithmEvents: EventEmitter<UpdateVertexEvent | CompletedEvent>): void {
    this.algorithmEvents$?.unsubscribe();
    this.algorithmEvents$ = algorithmEvents
    // this.algorithmEvents$ = DijkstraAlgorithm.event
      .subscribe((e) => {
        if (e.type === 'updateVertex') {
          this.addToPaintQueue(e.data);
        } else if (e.type === 'complete' && !e.isFinishFound) {
          this.toast.show({body: 'Finish could not be reached'});
        }
      });
  }

  private addToPaintQueue(data: {vertex: Vertex, newState: VertexState}): void {
    this.paintQueue.push(data);
    this.isPainting = true;
    const queueEvent = from(this.paintQueue)
      .pipe(concatMap( item => of(item).pipe(delay(10)) ));

    this.paintQueue$?.unsubscribe();
    this.zone.runOutsideAngular(() => {
      this.paintQueue$ = queueEvent.subscribe( () => this.paintVertex());
    });
  }

  private paintVertex(): void {
    let updateData = this.paintQueue.shift();
    updateData.vertex.state = updateData.newState;

    this.isPainting = !!this.paintQueue.length;
    this.cd.detectChanges();
  }

  private stopPainting(): void {
    this.paintQueue$.unsubscribe();
    this.paintQueue = [];
    this.isPainting = false;
  }

  clear(objectToClear: 'path' | 'all') {
    if (this.isPainting) {
      this.stopPainting();
    }
    if (objectToClear === 'path') {
      this.vertices.forEach(cell => cell.clearDirty());
    } else if (objectToClear === 'all') {
      this.vertices.forEach(cell => cell.clearNonPathMarkers());
    }
  }

  boardSquaresCounter(number: number): Array<any>{
    return new Array(number);
  }

}
