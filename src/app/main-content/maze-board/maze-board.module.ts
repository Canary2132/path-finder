import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MazeBoardComponent} from './maze-board.component';
import { MazeSquareComponent } from './maze-square/maze-square.component';
import {MouseEventService} from './services/mouse-event.service';
import {FormsModule} from '@angular/forms';
import {PathMarkersService} from './services/path-markers.service';

@NgModule({
  declarations: [MazeBoardComponent, MazeSquareComponent],
    imports: [
        CommonModule,
        FormsModule
    ],
  providers: [MouseEventService,
              PathMarkersService],
  exports: [MazeBoardComponent]
})
export class MazeBoardModule { }
