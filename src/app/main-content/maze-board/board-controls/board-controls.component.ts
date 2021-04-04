import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ControlActionEventClear, ControlActionEventsRun} from '../../../shared/interfaces/control-action-events';

enum PathFindAlgorithm {
  Dijkstra = 'Dijkstra Algorithm',
  AStar = 'A* Search',
  Swarm = 'Swarm Algorithm'
}

@Component({
  selector: 'app-board-controls',
  templateUrl: './board-controls.component.html',
  styleUrls: ['./board-controls.component.scss']
})
export class BoardControlsComponent implements OnInit {

  @Output('actionEvent') actionEvent: EventEmitter<ControlActionEventsRun | ControlActionEventClear> = new EventEmitter();

  algorithms = [PathFindAlgorithm.Dijkstra, PathFindAlgorithm.AStar, PathFindAlgorithm.Swarm];
  currentAlgorithm: PathFindAlgorithm = PathFindAlgorithm.Dijkstra;

  constructor() { }

  ngOnInit(): void {
  }

  findPath(): void {
    this.actionEvent.emit({type: 'findPath', algorithmName: this.currentAlgorithm});
  }

  clear(objectToClear: 'path' | 'all'): void {
    this.actionEvent.emit({type: 'clear', clearObject: objectToClear});
  }

  set pathFindAlgorithm(value: PathFindAlgorithm) {
    this.currentAlgorithm = value;
  }

}
