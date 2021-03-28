import {VertexState} from './enums/vertex-state.enum';
import {Vertex} from './interfaces/vertex';

export class GraphCreator {
  private static graph: Map<Vertex, Set<Vertex>>;

  private static board: Vertex[];
  private static colsAmount: number;
  private static rowsAmount: number;

  static fromBoard(board: Vertex[], rowsAmount: number, colsAmount: number): Map<Vertex, Set<Vertex>> {
    this.graph = new Map();
    this.board = board;
    this.rowsAmount = rowsAmount;
    this.colsAmount = colsAmount;

    const start = board.find(vertex => vertex.state === VertexState.start);
    this.addVertices(start);

    return this.graph;
  }

  private static addVertices(vertex: Vertex): void {
    if (!this.graph.has(vertex)) {
      this.graph.set(vertex, new Set());

      this.getVertexNeighbors(vertex).forEach(neighborVertex => {
        if (neighborVertex.state !== VertexState.wall) {
          this.addVertices(neighborVertex);
          this.addEdge(vertex, neighborVertex);
        }
      });
    }
  }

  private static addEdge(firstVertex: Vertex, secondVertex: Vertex): void {
    this.graph.get(firstVertex).add(secondVertex);
    this.graph.get(secondVertex).add(firstVertex);
  }

  private static getVertexNeighbors(vertex: Vertex): Vertex[] {
    const res = [];
    const row = vertex.boardRow;
    const col = vertex.boardCol;

    if (row - 1 >= 0) {
      res.push(this.board[(row - 1) * this.colsAmount + col]);
    }
    if (row + 1 < this.rowsAmount) {
      res.push(this.board[(row + 1) * this.colsAmount + col]);
    }
    if (col - 1 >= 0) {
      res.push(this.board[row * this.colsAmount + col - 1]);
    }
    if (col + 1 < this.colsAmount) {
      res.push(this.board[row * this.colsAmount + col + 1]);
    }
    return res;
  }

}
