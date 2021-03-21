import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MazeBoardComponent} from './maze-board.component';
import { MazeSquareComponent } from './maze-square/maze-square.component';
import {MouseEventService} from './mouse-event.service';

@NgModule({
  declarations: [MazeBoardComponent, MazeSquareComponent],
  imports: [
    CommonModule
  ],
  providers: [MouseEventService],
  exports: [MazeBoardComponent]
})
export class MazeBoardModule { }
