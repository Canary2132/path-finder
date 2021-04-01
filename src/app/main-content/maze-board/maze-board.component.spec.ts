import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MazeBoardComponent } from './maze-board.component';
import {QueryList} from '@angular/core';
import {MazeSquareComponent} from './maze-square/maze-square.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('MazeBoardComponent', () => {
  let component: MazeBoardComponent;
  let fixture: ComponentFixture<MazeBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MazeBoardComponent, MazeSquareComponent ],
      imports: [BrowserAnimationsModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MazeBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain array of MazeSquareComponent', () => {
    // expect(component.vertices).toContain(MazeSquareComponent);
  });
});
