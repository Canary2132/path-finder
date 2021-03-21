import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
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
  boardSquares: {animation: string}[][];

  constructor(private mouseEvent: MouseEventService) { }

  ngOnInit(): void {
    const rowsAmount = 30;
    const cellsAmount = 50;

    // use loop to gain better performance than fill and map
    this.boardSquares = new Array(rowsAmount);
    for (let i = 0; i < rowsAmount; i++) {
      this.boardSquares[i] = [];
      for (let j = 0; j < cellsAmount; j++) {
        this.boardSquares[i][j] = {animation: ''};
      }
    }
    this.addMouseEvents();
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

  boardSquaresCounter(number: number): Array<any>{
    return new Array(number);
  }


}
