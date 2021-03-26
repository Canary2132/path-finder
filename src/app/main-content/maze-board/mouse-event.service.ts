import { Injectable } from '@angular/core';

export enum MouseState {
  btnPressed = 'btnPressed',
  btnReleased = 'btnReleased',
  dragStartBadge = 'dragStartBadge',
  dragFinishBadge= 'dragFinishBadge'
}

@Injectable({
  providedIn: 'root'
})
export class MouseEventService {

  private _mouseState: MouseState = MouseState.btnReleased;

  constructor() { }

  set mouseState(state: MouseState) {
    this._mouseState = state;
  }

  get mouseState(): MouseState {
    return this._mouseState;
  }

  get isDraggingPathMarker(): boolean {
    return this._mouseState === MouseState.dragFinishBadge || this._mouseState === MouseState.dragStartBadge;
  }
}
