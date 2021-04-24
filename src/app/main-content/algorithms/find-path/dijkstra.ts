import {VertexState} from '../../../shared/enums/vertex-state.enum';
import {Vertex} from '../../../shared/interfaces/vertex';
import {EventEmitter} from '@angular/core';
import {CompletedEvent, UpdateVertexEvent} from '../../../shared/interfaces/algorithm-event';

export class DijkstraAlgorithm {
  static event: EventEmitter<UpdateVertexEvent | CompletedEvent> = new EventEmitter();

  private static previousVertex: Map<Vertex, Vertex>;
  private static distanceFromStart: Map<Vertex, number>;
  private static unvisitedVertices: Vertex[];
  private static graph: Map<Vertex, Set<Vertex>>;

  private static isFinishFound = false;

  static run(graph: Map<Vertex, Set<Vertex>>): void {
    this.setInitialData(graph);

    while (!this.isFinishFound && this.unvisitedVertices.length) {
      this.processDijkstraStep();
    }

    this.event.emit({type: 'complete', isFinishFound: this.isFinishFound});
  }

  private static setInitialData(graph: Map<Vertex, Set<Vertex>>): void {
    this.isFinishFound = false;
    this.graph = graph;
    const vertices = Array.from(graph.keys());
    this.distanceFromStart = new Map();
    this.previousVertex = new Map();
    this.unvisitedVertices = [];

    vertices.forEach(vertex => {
      this.distanceFromStart.set(vertex, vertex.state === VertexState.start ? 0 : Infinity);
      this.previousVertex.set(vertex, null);
      this.unvisitedVertices.push(vertex);
    });
  }

  private static processDijkstraStep(): void {
    const currentVertex = this.getClosestVertex();
    this.processVertex(currentVertex);

    if (currentVertex.state === VertexState.finish) {
      this.markOptimalPath(currentVertex);
      this.isFinishFound = true;
      return;
    }

    this.updateNeighborVerticesData(currentVertex);
  }

  private static processVertex(vertex: Vertex): void {
    this.markVertex(vertex, VertexState.inProcess);
    this.unvisitedVertices = this.unvisitedVertices.filter(el => el !== vertex);
    this.markVertex(vertex, VertexState.visited);
  }


  private static updateNeighborVerticesData(currentVertex: Vertex): void {
    const neighbors = this.graph.get(currentVertex);
    neighbors.forEach(neighborVertex => {
      const alternativeDistanceToNeighbor = this.distanceFromStart.get(currentVertex) + this.edgeWeight(currentVertex, neighborVertex);
      if (alternativeDistanceToNeighbor < this.distanceFromStart.get(neighborVertex)) {
        this.distanceFromStart.set(neighborVertex, alternativeDistanceToNeighbor);
        this.previousVertex.set(neighborVertex, currentVertex);
      }
    });
  }

  private static edgeWeight(vertex1, vertex2): number {
    return 1;
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

  private static getClosestVertex(): Vertex {
    return this.unvisitedVertices.sort((a, b) => {
      return this.distanceFromStart.get(a) - this.distanceFromStart.get(b);
    })[0];
  }
}
