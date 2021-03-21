import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MouseEventService {

  private _mouseState: 'btnPressed' | 'btnReleased' = 'btnReleased';

  constructor() { }

  set mouseState(state: 'btnPressed' | 'btnReleased') {
    this._mouseState = state;
  }

  get mouseState(): 'btnPressed' | 'btnReleased' {
    return this._mouseState;
  }
}
