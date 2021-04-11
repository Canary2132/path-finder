import {Vertex} from '../../shared/interfaces/vertex';
import {EventEmitter} from '@angular/core';
import {CompletedEvent, UpdateVertexEvent} from '../../shared/interfaces/algorithm-event';
import {VertexState} from '../../shared/enums/vertex-state.enum';

export class AStar {
  static event: EventEmitter<UpdateVertexEvent | CompletedEvent> = new EventEmitter<any>();

  private static previousVertex: Map<Vertex, Vertex>;
  private static distanceFromStart: Map<Vertex, number>;
  private static vertexScore: Map<Vertex, number>;
  private static verticesToOpen: Vertex[];
  private static finishVertex: Vertex;

  static run(graph: Map<Vertex, Set<Vertex>>, start: Vertex, finish: Vertex): void {
    this.setInitialData(graph, start, finish);

    while (this.verticesToOpen.length) {
      const currentVertex = this.getOptimalVertex();
      this.processVertex(currentVertex);

      if (currentVertex === finish) {
        this.markOptimalPath(currentVertex);
        this.event.emit({type: 'complete', isFinishFound: true});
        return;
      }

      this.processNeighbors(graph, currentVertex);
    }

    this.event.emit({type: 'complete', isFinishFound: false});
  }

  private static setInitialData(graph: Map<Vertex, Set<Vertex>>, start: Vertex, target: Vertex): void {
    this.finishVertex = target;
    this.verticesToOpen = [start];
    this.previousVertex = new Map();
    this.distanceFromStart = new Map();
    this.vertexScore = new Map();
    graph.forEach((vertexNeighbors, vertex)  => {
      this.distanceFromStart.set(vertex, Infinity);
      this.vertexScore.set(vertex, Infinity);
    });
    this.distanceFromStart.set(start, 0);
    this.vertexScore.set(start, this.shortestDistanceToFinish(start));
  }

  private static processVertex(vertex: Vertex): void {
    this.markVertex(vertex, VertexState.inProcess);
    this.verticesToOpen = this.verticesToOpen.filter(el => el !== vertex);
    this.markVertex(vertex, VertexState.visited);
  }


  private static processNeighbors(graph: Map<Vertex, Set<Vertex>>, currentVertex: Vertex): void {
    graph.get(currentVertex).forEach(neighborVertex => {
      const tentativeDistanceFromStart = this.distanceFromStart.get(currentVertex) + this.edgeWeight(currentVertex, neighborVertex);
      if (tentativeDistanceFromStart < this.distanceFromStart.get(neighborVertex)) {
        this.updateNeighborVerticesData(currentVertex, neighborVertex, tentativeDistanceFromStart);
      }
    });
  }

  private static updateNeighborVerticesData(current: Vertex, neighbor: Vertex, newDistanceFromStart: number): void {
    this.previousVertex.set(neighbor, current);
    this.distanceFromStart.set(neighbor, newDistanceFromStart);
    this.vertexScore.set(neighbor, newDistanceFromStart + this.shortestDistanceToFinish(neighbor));

    if (!this.verticesToOpen.includes(neighbor)) {
      this.verticesToOpen.unshift(neighbor);
    }
  }

  private static shortestDistanceToFinish(vertex: Vertex): number {
  const rowDiff = Math.abs(this.finishVertex.boardRow - vertex.boardRow);
  const colDiff = Math.abs(this.finishVertex.boardCol - vertex.boardCol);
  return (rowDiff + colDiff);
}

  private static edgeWeight(vertex1, vertex2): number {
    return 1;
  }

  private static getOptimalVertex(): Vertex {
    return this.verticesToOpen.sort((a, b) => {
      return this.vertexScore.get(a) - this.vertexScore.get(b);
    })[0];
  }

  private static markOptimalPath(lastVertex: Vertex): void {
    let optimalPathVertex = lastVertex;
    while (optimalPathVertex) {
      this.markVertex(optimalPathVertex, VertexState.optimalPath);
      optimalPathVertex = this.previousVertex.get(optimalPathVertex);
    }
  }

  private static markVertex(vertex: Vertex, state: VertexState): void {
    const vertexIsPathMarker = vertex.state === VertexState.finish || vertex.state === VertexState.start;
    const newState = vertexIsPathMarker ? vertex.state : state;

    this.event.emit({type: 'updateVertex', data: {vertex, newState}});
  }
}
