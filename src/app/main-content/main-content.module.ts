import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainContentComponent } from './main-content.component';
import { MazeBoardComponent } from './maze-board/maze-board.component';
import {MazeBoardModule} from './maze-board/maze-board.module';



@NgModule({
  declarations: [MainContentComponent],
  imports: [
    CommonModule,
    MazeBoardModule
  ],
  exports: [MainContentComponent]
})
export class MainContentModule { }
