import {TestBed} from '@angular/core/testing';

import {MouseEventService, MouseState} from './mouse-event.service';

describe('MouseEventService', () => {
  let service: MouseEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MouseEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save mouse state', () => {
    service.mouseState = MouseState.btnPressed;
    expect(service.mouseState).toBe(MouseState.btnPressed);
  });

  it('should inform if path marker is dragging ', () => {
    service.mouseState = MouseState.dragFinishBadge;
    expect(service.isDraggingPathMarker).toBeTrue();
    service.mouseState = MouseState.btnReleased;
    expect(service.isDraggingPathMarker).toBeFalse();
  });
});
