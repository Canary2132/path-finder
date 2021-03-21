import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MazeBoardComponent } from './maze-board.component';

describe('MazeBoardComponent', () => {
  let component: MazeBoardComponent;
  let fixture: ComponentFixture<MazeBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MazeBoardComponent ]
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
});
