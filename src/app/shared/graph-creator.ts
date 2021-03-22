export class GraphCreator {
  private static graph = new Map();

  static fromBoard(board: any[][]): Map<any, any> {
    // only for printGraph
    // board.forEach((row, rowIndex) => {
    //   row.forEach((el, i) => {
    //     el.row = rowIndex;
    //     el.col = i;
    //   });
    // });

    board.flat().forEach(this.addVertex.bind(this));

    for (let row = 0; row < board.length; row++) {
      // loop thought board in chess order to ignore double handling same squares
      for (let cell = Math.round(row % 2); cell < board[row].length - (1 - Math.round(row % 2)); cell += 2) {
        if (row) {
          this.addEdge(board[row][cell], board[row - 1][cell]);
        }
        if (row + 1 < board.length) {
          this.addEdge(board[row][cell], board[row + 1][cell]);
        }
        if (cell) {
          this.addEdge(board[row][cell], board[row][cell - 1]);
        }
        if (cell + 1 < board[row].length) {
          this.addEdge(board[row][cell], board[row][cell + 1]);
        }
      }
    }
    return this.graph;
  }

  private static addVertex(v): void {
    this.graph.set(v, new Set());
  }

  private static addEdge(v,w): void {
    this.graph.get(v).add(w);
    this.graph.get(w).add(v);
  }

  // private printGraph() {
  //   let keys = this.graph.keys();
  //
  //   for (let i of keys) {
  //     let values = this.graph.get(i);
  //     let conc = '';
  //
  //     for (let j of values) {
  //       conc += `${j.row}-${j.col}` + ' ';
  //     }
  //
  //     console.dir(`${i.row}-${i.col}  -> ` + conc);
  //   }
  // }

}
