import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MazeSquareComponent } from './maze-square.component';

describe('MazeSquareComponent', () => {
  let component: MazeSquareComponent;
  let fixture: ComponentFixture<MazeSquareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MazeSquareComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MazeSquareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
