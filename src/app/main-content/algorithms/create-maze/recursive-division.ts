import {VertexState} from '../../../shared/enums/vertex-state.enum';
import {EventEmitter} from '@angular/core';
import {UpdateVertexEvent} from '../../../shared/interfaces/algorithm-event';
import {Vertex} from '../../../shared/interfaces/vertex';

export class RecursiveDivision {
  static event: EventEmitter<UpdateVertexEvent> = new EventEmitter();

  private static board: Vertex[];
  private static totalColumnsAmount: number;

  static createMaze(board: Vertex[],
                    colsAmount: number,
                    rowsAmount: number): void {
    this.board = board;
    this.totalColumnsAmount = colsAmount;

    if (Math.random() > 0.495) {
      this.createHorizontalWall(colsAmount - 1,  0, rowsAmount - 1, 0);
    } else {
      this.createVerticalWall(colsAmount - 1,  0, rowsAmount - 1, 0);
    }
  }

  private static createHorizontalWall(maxCol: number,
                                      minCol: number,
                                      maxRow: number,
                                      minRow: number): void {
    if (maxRow <= minRow || maxCol <= minCol) return;

    const wallRow = this.getWallIndex(minRow, maxRow);
    const gateCol = this.getGateIndex(minCol, maxCol);
    for (let i = minCol; i < maxCol + 1; i++) {
      if (i === gateCol) continue;
      this.event.emit({type: 'updateVertex',
                              data: {vertex: this.board[this.totalColumnsAmount * wallRow + i],
                                      newState: VertexState.wall}});
    }

    if (wallRow - 1 - minRow > maxCol - minCol) {
      this.createHorizontalWall(maxCol, minCol, wallRow - 1, minRow);
    } else {
      this.createVerticalWall(maxCol, minCol, wallRow - 1, minRow);
    }
    if (maxRow - (wallRow + 1) > maxCol - minCol) {
      this.createHorizontalWall(maxCol, minCol, maxRow, wallRow + 1);
    } else {
      this.createVerticalWall(maxCol, minCol, maxRow, wallRow + 1);
    }

  }

  private static createVerticalWall(maxCol: number,
                                    minCol: number,
                                    maxRow: number,
                                    minRow: number): void {
    if (maxRow <= minRow || maxCol <= minCol) return;

    const wallCol = this.getWallIndex(minCol, maxCol);
    const gateRow = this.getGateIndex(minRow, maxRow);
    for (let i = minRow; i < maxRow + 1; i++) {
      if (i === gateRow) continue;
      this.event.emit({type: 'updateVertex',
                              data: {vertex: this.board[this.totalColumnsAmount * i + wallCol],
                                      newState: VertexState.wall}});
    }

    if (maxRow - minRow > wallCol - 1 - minCol) {
      this.createHorizontalWall(wallCol - 1, minCol, maxRow, minRow);
    } else {
      this.createVerticalWall(wallCol - 1, minCol, maxRow, minRow);
    }
    if (maxRow - minRow > maxCol - (wallCol + 1)) {
      this.createHorizontalWall(maxCol, wallCol + 1, maxRow, minRow);
    } else {
      this.createVerticalWall(maxCol, wallCol + 1, maxRow, minRow);
    }
  }

  private static getWallIndex(minIndex: number, maxIndex: number): number {
    const possibleWalls = [];
    for (let i = minIndex; i < maxIndex; i++){
      if (i % 2 === 1) continue;
      possibleWalls.push(i);
    }
    const randomWallIndex = Math.floor(Math.random() * possibleWalls.length);
    return  possibleWalls[randomWallIndex];
  }

  private static getGateIndex(minIndex: number, maxIndex: number): number {
    const possibleGates = [];
    for (let i = minIndex; i <= maxIndex; i++){
      if (i % 2 === 0) continue;
      possibleGates.push(i);
    }
    const randomGateIndex = Math.floor(Math.random() * possibleGates.length);
    return possibleGates[randomGateIndex];
  }

}




