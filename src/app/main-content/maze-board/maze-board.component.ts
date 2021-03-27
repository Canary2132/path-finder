import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {concat, from, fromEvent, of, Subscription} from 'rxjs';
import {MouseEventService, MouseState} from './mouse-event.service';
import {MazeSquareComponent} from './maze-square/maze-square.component';
import {GraphCreator} from '../../shared/graph-creator';
import {delayTimer} from '../../shared/helper';
import {VertexState} from '../../shared/enums/vertex-state.enum';
import {Vertex} from '../../shared/interfaces/vertex';
import {concatMap, delay, last, takeLast} from 'rxjs/operators';
import {DijkstraAlgorithm} from '../algorithms/dijkstra';

const ANIMATION_DELAY = 50;

@Component({
  selector: 'app-maze-board',
  templateUrl: './maze-board.component.html',
  styleUrls: ['./maze-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MazeBoardComponent implements OnInit, AfterViewInit {

  @ViewChild('board', {static: true}) board: ElementRef;
  @ViewChildren('cmp') comp: QueryList<MazeSquareComponent>;
  boardSquares: Vertex[][];

  private rowsAmount = 30;
  private cellsAmount = 50;

  private graph: Map<Vertex, Vertex[]>;

  private paintQueue$;
  private paintQueue = [];

  isPainting = false;
  private algorithmEvents$;

  constructor(private mouseEvent: MouseEventService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.createBoard();
    this.addMouseEvents();
    this.setDefaultPath();
  }

  private createBoard(){
    // use loop to gain better performance than fill and map
    this.boardSquares = new Array(this.rowsAmount);
    for (let i = 0; i < this.rowsAmount; i++) {
      this.boardSquares[i] = [];
      for (let j = 0; j < this.cellsAmount; j++) {
        this.boardSquares[i][j] = {id: `${i}-${j}`, state: VertexState.empty};
      }
    }
  }

  private setDefaultPath(): void {
    this.boardSquares[10][10].state = VertexState.start;
    this.boardSquares[10][30].state = VertexState.finish;
  }

  ngAfterViewInit(): void {
    // console.log(this.comp.toArray());
  }

  private addMouseEvents(): void {
    fromEvent(document, 'mouseup').subscribe((e: MouseEvent) => {
      e.preventDefault();
      this.mouseEvent.mouseState = MouseState.btnReleased;
    });
  }

  runDijkstra(): void {
    this.clearPath();
    this.graph = GraphCreator.fromBoard(this.boardSquares);
    this.algorithmEvents$?.unsubscribe();
    this.algorithmEvents$ = DijkstraAlgorithm.event.subscribe(data => this.addToPaintQueue(data));
    DijkstraAlgorithm.run(this.graph);
  }

  private addToPaintQueue(data: {vertex: Vertex, newState: VertexState}): void {
    this.paintQueue.push(data);
    this.isPainting = true;

    const queueEvent = from(this.paintQueue)
      .pipe(concatMap( item => of(item).pipe(delay(0)) ));

    this.paintQueue$?.unsubscribe();
    this.paintQueue$ = queueEvent.subscribe( () => this.paintVertex());
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

  clearPath(): void {
    if (this.isPainting) {
      this.stopPainting();
    }

    this.boardSquares.forEach(row => {
      row.forEach(cell => {
        cell.state = this.squareIsDirty(cell) ? VertexState.empty : cell.state;
      });
    });
  }

  private squareIsDirty(square: Vertex): boolean {
    return square.state === VertexState.passed || square.state === VertexState.optimalPath || square.state === VertexState.inProcess;
  }

}
