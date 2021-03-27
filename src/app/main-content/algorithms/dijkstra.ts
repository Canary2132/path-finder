import {VertexState} from '../../shared/enums/vertex-state.enum';
import {Vertex} from '../../shared/interfaces/vertex';
import {EventEmitter} from '@angular/core';
import {CompletedEvent, UpdateVertexEvent} from '../../shared/interfaces/algorithm-event';

export class DijkstraAlgorithm {
  static event: EventEmitter<UpdateVertexEvent | CompletedEvent> = new EventEmitter<any>();

  private static previousVertex: Map<Vertex, Vertex>;
  private static distanceFromStart: Map<Vertex, number>;
  private static unvisitedVertices: Vertex[];
  private static graph: Map<Vertex, Vertex[]>;

  private static isFinishFound = false;

  static run(graph: Map<Vertex, Vertex[]>): void {
    this.isFinishFound = false;
    this.setInitialData(graph);

    while (!this.isFinishFound && this.unvisitedVertices.length) {
      this.processDijkstraStep();
    }

    this.event.emit({type: 'complete', isFinishFound: this.isFinishFound});
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
    this.markVertex(vertex, VertexState.passed);
  }

  private static setInitialData(graph: Map<Vertex, Vertex[]>): void {
    this.graph = graph;
    const vertices = Array.from(graph.keys());
    this.unvisitedVertices = [];
    this.distanceFromStart = new Map();
    this.previousVertex = new Map();

    vertices.forEach(vertex => {
      this.distanceFromStart.set(vertex, vertex.state === VertexState.start ? 0 : Infinity);
      this.previousVertex.set(vertex, null);
      this.unvisitedVertices.push(vertex);
    });
  }

  private static updateNeighborVerticesData(currentVertex: Vertex): void {
    // todo add opportunity to work with distances other than 1
    const neighbors = this.graph.get(currentVertex);
    neighbors.forEach(neighborVertex => {
      if (this.distanceFromStart.get(neighborVertex) === Infinity && this.unvisitedVertices.includes(neighborVertex)) {
        this.distanceFromStart.set(neighborVertex, 1);
        this.previousVertex.set(neighborVertex, currentVertex);
      }
    });
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
      if (this.distanceFromStart.get(a) === null) return 1;
      if (this.distanceFromStart.get(b) === null) return -1;
      return this.distanceFromStart.get(a) - this.distanceFromStart.get(b);
    })[0];
  }
}
