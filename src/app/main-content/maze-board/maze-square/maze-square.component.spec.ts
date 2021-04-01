import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MazeSquareComponent } from './maze-square.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('MazeSquareComponent', () => {
  let component: MazeSquareComponent;
  let fixture: ComponentFixture<MazeSquareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MazeSquareComponent ],
      imports: [ BrowserAnimationsModule ],
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
