import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MazeBoardComponent} from './maze-board.component';
import { MazeSquareComponent } from './maze-square/maze-square.component';
import {MouseEventService} from './services/mouse-event.service';
import {FormsModule} from '@angular/forms';
import {PathMarkersService} from './services/path-markers.service';
import {NgbDropdownModule, NgbToastModule} from '@ng-bootstrap/ng-bootstrap';
import { BoardControlsComponent } from './board-controls/board-controls.component';

@NgModule({
  declarations: [MazeBoardComponent, MazeSquareComponent, BoardControlsComponent],
    imports: [
        CommonModule,
        FormsModule,
        NgbDropdownModule
    ],
  providers: [MouseEventService,
              PathMarkersService],
  exports: [MazeBoardComponent]
})
export class MazeBoardModule { }
