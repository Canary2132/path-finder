import {VertexState} from '../enums/vertex-state.enum';

export interface Vertex {
  boardRow: number;
  boardCol: number;
  state: VertexState;
}
