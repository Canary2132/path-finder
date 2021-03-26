import {SquareState} from '../main-content/maze-board/maze-square/maze-square.component';

export class GraphCreator {
  private static graph;

  static fromBoard(board: any[][]): Map<any, any> {
    this.graph = new Map();

    const start = board.flat().find(v => v.state === SquareState.start);
    this.addVertices(start, board);

    // this.printGraph();

    return this.graph;
  }

  private static addVertices(vertex, board): void {
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

  private static addEdge(v, w): void {
    if (v.state !== SquareState.wall && w.state !== SquareState.wall){
      this.graph.get(v).add(w);
      this.graph.get(w).add(v);
    }
  }


  private static getVertexNeighbors(vertexId, board) {
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

  private static printGraph() {
    let keys = this.graph.keys();

    for (let i of keys) {
      let values = this.graph.get(i);
      let conc = '';

      for (let j of values) {
        conc += `${j.id}` + ' ';
      }

      console.dir(`${i.id}  -> ` + conc);
    }
  }

}
