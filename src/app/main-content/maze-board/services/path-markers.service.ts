import { Injectable } from '@angular/core';
import {VertexState} from '../../../shared/enums/vertex-state.enum';
import {Vertex} from '../../../shared/interfaces/vertex';

@Injectable({
  providedIn: 'root'
})
export class PathMarkersService {

  private _startMarker;
  private _finishMarker;

  constructor() { }

  set newStart(vertex: Vertex) {
    if (vertex.state !== VertexState.finish) {
      vertex.state = VertexState.start;
      if (this._startMarker) {
        this._startMarker.state = VertexState.empty;
      }
      this._startMarker = vertex;
    }
  }

  set newFinish(vertex: Vertex) {
    if (vertex.state !== VertexState.start) {
      vertex.state = VertexState.finish;
      if (this._finishMarker) {
        this._finishMarker.state = VertexState.empty;
      }
      this._finishMarker = vertex;
    }
  }
}
