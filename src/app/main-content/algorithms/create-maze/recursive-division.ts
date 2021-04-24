import {VertexState} from '../../../shared/enums/vertex-state.enum';
import {EventEmitter} from '@angular/core';
import {UpdateVertexEvent} from '../../../shared/interfaces/algorithm-event';
import {Vertex} from '../../../shared/interfaces/vertex';
import {IChamberData} from '../../../shared/interfaces/maze-generation';

export class RecursiveDivision {
  static event: EventEmitter<UpdateVertexEvent> = new EventEmitter();

  private static board: Vertex[];
  private static totalColumnsAmount: number;

  static createMaze(board: Vertex[],
                    colsAmount: number,
                    rowsAmount: number): void {
    this.board = board;
    this.totalColumnsAmount = colsAmount;

    const mainChamber = {
      maxCol: colsAmount - 1,
      minCol: 0,
      maxRow: rowsAmount - 1,
      minRow: 0
    };
    if (Math.random() > 0.495) {
      this.divideChamberHorizontally(mainChamber);
    } else {
      this.divideChamberVertically(mainChamber);
    }
  }

  private static divideChamberIntelligently(chamberData: IChamberData): void{
    if (this.isChamberTall(chamberData)) {
      this.divideChamberHorizontally(chamberData);
    } else {
      this.divideChamberVertically(chamberData);
    }
  }

  private static divideChamberHorizontally(chamberData: IChamberData): void {
    if (this.isChamberFlattened(chamberData)) return;

    const wallRow = this.getWallIndex(chamberData.minRow, chamberData.maxRow);
    this.drawHorizontalWall(chamberData, wallRow);

    const subChamber1 = Object.assign({}, chamberData, {maxRow: wallRow - 1});
    const subChamber2 = Object.assign({}, chamberData, {minRow: wallRow + 1});
    this.divideChamberIntelligently(subChamber1);
    this.divideChamberIntelligently(subChamber2);
  }

  private static drawHorizontalWall(chamberData: IChamberData, wallRow: number): void{
    const passageCol = this.getPassageIndex(chamberData.minCol, chamberData.maxCol);
    for (let i = chamberData.minCol; i < chamberData.maxCol + 1; i++) {
      if (i === passageCol) continue;
      this.markVertex(this.board[this.totalColumnsAmount * wallRow + i], VertexState.wall);
    }
  }

  private static divideChamberVertically(chamberData: IChamberData): void {
    if (this.isChamberFlattened(chamberData)) return;

    const wallCol = this.getWallIndex(chamberData.minCol, chamberData.maxCol);
    this.drawVerticalWall(chamberData, wallCol);

    const subChamber1 = Object.assign({}, chamberData, {maxCol: wallCol - 1});
    const subChamber2 = Object.assign({}, chamberData, {minCol: wallCol + 1});
    this.divideChamberIntelligently(subChamber1);
    this.divideChamberIntelligently(subChamber2);
  }

  private static drawVerticalWall(chamberData: IChamberData, wallCol: number): void {
    const passageRow = this.getPassageIndex(chamberData.minRow, chamberData.maxRow);
    for (let i = chamberData.minRow; i < chamberData.maxRow + 1; i++) {
      if (i === passageRow) continue;
      this.markVertex(this.board[this.totalColumnsAmount * i + wallCol], VertexState.wall);
    }
  }

  private static isChamberFlattened(chamberData: IChamberData): boolean {
    return chamberData.maxRow <= chamberData.minRow || chamberData.maxCol <= chamberData.minCol;
  }

  private static isChamberTall(chamberData: IChamberData): boolean {
    return chamberData.maxRow - chamberData.minRow > chamberData.maxCol - chamberData.minCol;
  }

  private static markVertex(vertex: Vertex, state: VertexState): void {
    const vertexIsPathMarker = vertex.state === VertexState.finish || vertex.state === VertexState.start;
    const newState = vertexIsPathMarker ? vertex.state : state;

    this.event.emit({type: 'updateVertex', data: {vertex, newState}});
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

  private static getPassageIndex(minIndex: number, maxIndex: number): number {
    const possibleGates = [];
    for (let i = minIndex; i <= maxIndex; i++){
      if (i % 2 === 0) continue;
      possibleGates.push(i);
    }
    const randomGateIndex = Math.floor(Math.random() * possibleGates.length);
    return possibleGates[randomGateIndex];
  }

}




