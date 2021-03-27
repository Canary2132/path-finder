import {Vertex} from './vertex';
import {VertexState} from '../enums/vertex-state.enum';

interface IEvent {
  type: string;
}

export interface UpdateVertexEvent extends IEvent {
  type: 'updateVertex';
  data: {
    vertex: Vertex;
    newState: VertexState;
  };
}

export interface CompletedEvent extends IEvent {
  type: 'complete';
  isFinishFound: boolean;
}

