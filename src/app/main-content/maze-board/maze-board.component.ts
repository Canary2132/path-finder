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
import {fromEvent} from 'rxjs';
import {MouseEventService, MouseState} from './mouse-event.service';
import {MazeSquareComponent, SquareState} from './maze-square/maze-square.component';
import {GraphCreator} from '../../shared/graph-creator';
import {delayTimer} from '../../shared/helper';

@Component({
  selector: 'app-maze-board',
  templateUrl: './maze-board.component.html',
  styleUrls: ['./maze-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MazeBoardComponent implements OnInit, AfterViewInit {

  @ViewChild('board', {static: true}) board: ElementRef;
  @ViewChildren('cmp') comp: QueryList<MazeSquareComponent>;
  boardSquares: {
    state: string}[][];

  private rowsAmount = 30;
  private cellsAmount = 50;

  private graph: Map<any, any>;

  constructor(private mouseEvent: MouseEventService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {

    // use loop to gain better performance than fill and map
    this.boardSquares = new Array(this.rowsAmount);
    for (let i = 0; i < this.rowsAmount; i++) {
      this.boardSquares[i] = [];
      for (let j = 0; j < this.cellsAmount; j++) {
        this.boardSquares[i][j] = {state: SquareState.empty};
      }
    }
    this.addMouseEvents();
    this.setDefaultPath();

    this.graph = GraphCreator.fromBoard(this.boardSquares);
  }

  private setDefaultPath(): void {
    this.boardSquares[10][10].state = SquareState.start;
    this.boardSquares[10][13].state = SquareState.finish;
  }

  ngAfterViewInit(): void {
    // console.log(this.comp.toArray());
  }

  addMouseEvents(): void {
    const up$ = fromEvent(document, 'mouseup');

    up$.subscribe((e: MouseEvent) => {
      e.preventDefault();
      this.mouseEvent.mouseState = MouseState.btnReleased;
    });
  }

  async dijkstraAlgorithm() {
    let unvisitedVertices = [];
    let distances = new Map();
    let previous = new Map();

    Array.from(this.graph.keys()).forEach((el, i) => {
      distances.set(el, el.state === SquareState.start ? 0 : null);
      previous.set(el, null);
      unvisitedVertices.push(el);
    });

    while (unvisitedVertices.length) {
      const cur = this.getClosestVertex(unvisitedVertices, distances);

      cur.state = cur.state === SquareState.empty ? SquareState.passed : cur.state;
      this.cd.detectChanges();
      await delayTimer(100);

      unvisitedVertices = unvisitedVertices.filter(el => el !== cur);

      if (cur.state === SquareState.finish) {
        let path = cur;
        while (path) {
          const a = path;
          console.log('a.state', a.state)
          a.state = a.state === SquareState.passed ? SquareState.optimalPath : a.state;
          this.cd.detectChanges();
          await delayTimer(100);
          path = previous.get(path);
        }
        return;
      }

      this.graph.get(cur).forEach(el => {
        if (!distances.get(el) && unvisitedVertices.find(exist => exist === el)) {
          distances.set(el, 1);
          previous.set(el, cur);
        }
      });
    }
  }

  private getClosestVertex(vertices, distances) {
    return vertices.sort((a, b) => {
      if (distances.get(a) === null) return 1;
      if (distances.get(b) === null) return -1;
      return distances.get(a) - distances.get(b);
    })[0];
  }

}
