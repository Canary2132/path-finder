import {TestBed} from '@angular/core/testing';

import {PathMarkersService} from './path-markers.service';
import {VertexState} from '../../../shared/enums/vertex-state.enum';

describe('PathMarkersService', () => {
  let service: PathMarkersService;

  beforeEach(() => {
    TestBed.configureTestingModule({providers: [PathMarkersService]});
    service = TestBed.inject(PathMarkersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('newStart should change vertex state to VertexState.start', () => {
    const vertex = {boardCol: 0, boardRow: 0, state: VertexState.empty};
    service.newStart = vertex;
    expect(vertex.state).toBe(VertexState.start);
  });

  it('newStart should change previous start vertex state to VertexState.empty', () => {
    const vertex = {boardCol: 0, boardRow: 0, state: VertexState.empty};
    service.newStart = vertex;
    service.newStart = {boardCol: 1, boardRow: 1, state: VertexState.empty};
    expect(vertex.state).toBe(VertexState.empty);
  });

  it('newStart shouldn`t change finish vertex state', () => {
    const vertex = {boardCol: 0, boardRow: 0, state: VertexState.finish};
    service.newStart = vertex;
    expect(vertex.state === VertexState.empty).toBeFalse();
  });

  it('newFinish should change vertex state to VertexState.finish', () => {
    const vertex = {boardCol: 0, boardRow: 0, state: VertexState.empty};
    service.newFinish = vertex;
    expect(vertex.state).toBe(VertexState.finish);
  });

  it('newFinish should change previous finish vertex state to VertexState.empty', () => {
    const vertex = {boardCol: 0, boardRow: 0, state: VertexState.empty};
    service.newFinish = vertex;
    service.newFinish = {boardCol: 1, boardRow: 1, state: VertexState.empty};
    expect(vertex.state).toBe(VertexState.empty);
  });

  it('newFinish shouldn`t change start vertex state', () => {
    const vertex = {boardCol: 0, boardRow: 0, state: VertexState.start};
    service.newFinish = vertex;
    expect(vertex.state === VertexState.empty).toBeFalse();
  });
});
