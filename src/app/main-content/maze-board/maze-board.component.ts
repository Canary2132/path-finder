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
import {MouseEventService} from './mouse-event.service';
import {MazeSquareComponent} from './maze-square/maze-square.component';

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
    animation: string,
    [key: string]: any}[][];

  start;
  finish;

  private rowsAmount = 30;
  private cellsAmount = 50;

  constructor(private mouseEvent: MouseEventService, private cd: ChangeDetectorRef) { }

  ngOnInit(): void {

    // use loop to gain better performance than fill and map
    this.boardSquares = new Array(this.rowsAmount);
    for (let i = 0; i < this.rowsAmount; i++) {
      this.boardSquares[i] = [];
      for (let j = 0; j < this.cellsAmount; j++) {
        this.boardSquares[i][j] = {animation: ''};
      }
    }
    this.addMouseEvents();

    this.dijkstraAlgrithm();
  }

  ngAfterViewInit(): void {
    // console.log(this.comp.toArray());
  }

  addMouseEvents() {
    const up$ = fromEvent(document, 'mouseup');

    up$.subscribe((e: MouseEvent) => {
      e.preventDefault();
      console.log('up');
      this.mouseEvent.mouseState = 'btnReleased';
    });
  }

  dijkstraAlgrithm() {
    let quary = [];
    let distances = new Map();
    let previous = new Map();

    this.boardSquares.forEach((row, rowIndex) => {
      row.forEach((el, i) => {
        el.row = rowIndex;
        el.col = i;
      });
    });

    const graph = this.boardSquares.flat();
    graph.forEach((el, i) => {
      distances.set(el, null);
      previous.set(el, null);
      quary.push(el);

      if (i === 51){
        distances.set(el, 0);
        el.start = true;
      }
    });

    this.boardSquares[10][1].finish = true;

    let i = 0;
    while (quary.length) {
      const cur = quary.sort((a, b) => {
        if (distances.get(a) === null) return 1;
        if (distances.get(b) === null) return -1;
        return distances.get(a) - distances.get(b);
      })[0];

      setTimeout(() => {
        cur.animation = 'passed';
        this.cd.detectChanges();
      }, i * 100)


      quary = quary.filter(el => el !== cur);

      if (cur.finish) {
        let path = cur;
        while (path) {
          const a = path;
          setTimeout(() => {
            a.animation = 'wall';
            this.cd.detectChanges();
          }, i * 100)
          path = previous.get(path);
          i++;
        }
        return;
      }

      i++;

      const neighbors = this.getVertexNeighbors(cur);

      neighbors.forEach(el => {
        if (!distances.get(el) && quary.find(exist => exist === el)) {
          distances.set(el, 1);
          previous.set(el, cur);
        }
      })
    }
  }

  private getVertexNeighbors(vertex) {
    let nextRow = vertex.row < this.rowsAmount - 1 ? [this.boardSquares[vertex.row + 1][vertex.col]] : [];
    let prevRow = vertex.row > 0 ? [this.boardSquares[vertex.row - 1][vertex.col]] : [];
    let nextCol = vertex.col < this.cellsAmount - 1 ? [this.boardSquares[vertex.row][vertex.col + 1]] : [];
    let prevCol = vertex.col > 0 ? [this.boardSquares[vertex.row][vertex.col - 1]] : [];
    return nextRow.concat(...nextCol, ...prevCol, ...prevRow);
  }

}
