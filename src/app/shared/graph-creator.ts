import {SquareState} from './enums/square-state.enum';
import {Square} from './interfaces/square';

export class GraphCreator {
  private static graph;

  static fromBoard(board: Square[][]): Map<Square, Square[]> {
    this.graph = new Map();

    const start = board.flat().find(v => v.state === SquareState.start);
    this.addVertices(start, board);

    // this.printGraph();

    return this.graph;
  }

  private static addVertices(vertex: Square, board: Square[][]): void {
    if (!this.graph.has(vertex)) {
      this.graph.set(vertex, new Set());

      this.getVertexNeighbors(vertex.id, board).forEach(el => {
        if (el.state !== SquareState.wall) {
          this.addVertices(el, board);
          this.addEdge(vertex, el);
        }
      });
    }
  }

  private static addEdge(v: Square, w: Square): void {
    if (v.state !== SquareState.wall && w.state !== SquareState.wall){
      this.graph.get(v).add(w);
      this.graph.get(w).add(v);
    }
  }


  private static getVertexNeighbors(vertexId: string, board: Square[][]): Square[] {
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
