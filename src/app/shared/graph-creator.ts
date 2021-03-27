import {VertexState} from './enums/vertex-state.enum';
import {Vertex} from './interfaces/vertex';

export class GraphCreator {
  private static graph;

  static fromBoard(board: Vertex[][]): Map<Vertex, Vertex[]> {
    this.graph = new Map();

    const start = board.flat().find(vertex => vertex.state === VertexState.start);
    this.addVertices(start, board);

    // this.printGraph();

    return this.graph;
  }

  private static addVertices(vertex: Vertex, board: Vertex[][]): void {
    if (!this.graph.has(vertex)) {
      this.graph.set(vertex, new Set());

      this.getVertexNeighbors(vertex.id, board).forEach(neighborVertex => {
        if (neighborVertex.state !== VertexState.wall) {
          this.addVertices(neighborVertex, board);
          this.addEdge(vertex, neighborVertex);
        }
      });
    }
  }

  private static addEdge(firstVertex: Vertex, secondVertex: Vertex): void {
    this.graph.get(firstVertex).add(secondVertex);
    this.graph.get(secondVertex).add(firstVertex);
  }

  private static getVertexNeighbors(vertexId: string, board: Vertex[][]): Vertex[] {
    const res = [];
    const row = +vertexId.split('-')[0];
    const col = +vertexId.split('-')[1];

    if (board[row - 1] && board[row - 1][col]) {
      res.push(board[row - 1][col]);
    }
    if (board[row + 1] && board[row + 1][col]) {
      res.push(board[row + 1][col]);
    }
    if (board[row][col - 1]) {
      res.push(board[row][col - 1]);
    }
    if (board[row][col + 1]) {
      res.push(board[row][col + 1]);
    }
    return res;
  }

  // private static printGraph() {
  //   let keys = this.graph.keys();
  //
  //   for (let i of keys) {
  //     let values = this.graph.get(i);
  //     let conc = '';
  //
  //     for (let j of values) {
  //       conc += `${j.id} `;
  //     }
  //
  //     console.log(`${i.id}  ->  ${conc}`);
  //   }
  // }

}
