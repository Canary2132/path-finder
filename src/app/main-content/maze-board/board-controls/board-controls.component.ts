import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ControlAction, ControlActionEventClear, ControlActionEventsRun} from '../../../shared/interfaces/control-action-events';
import {PathFindAlgorithm} from '../../../shared/enums/path-find-algorithm.enum';

@Component({
  selector: 'app-board-controls',
  templateUrl: './board-controls.component.html',
  styleUrls: ['./board-controls.component.scss']
})
export class BoardControlsComponent implements OnInit {

  @Output() actionEvent: EventEmitter<ControlAction> = new EventEmitter();

  algorithms = [PathFindAlgorithm.Dijkstra, PathFindAlgorithm.AStar];
  currentAlgorithm: PathFindAlgorithm = PathFindAlgorithm.AStar;

  constructor() { }

  ngOnInit(): void {
  }

  findPath(): void {
    this.actionEvent.emit({type: 'findPath', algorithmName: this.currentAlgorithm});
  }

  createMaze(): void {
    this.actionEvent.emit({type: 'createMaze'});
  }

  clear(objectToClear: 'path' | 'all'): void {
    this.actionEvent.emit({type: 'clear', clearObject: objectToClear});
  }

  set pathFindAlgorithm(value: PathFindAlgorithm) {
    this.currentAlgorithm = value;
  }

}
