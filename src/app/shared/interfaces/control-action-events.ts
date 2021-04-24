import {PathFindAlgorithm} from '../enums/path-find-algorithm.enum';

export interface ControlActionEventsRun{
  type: 'findPath';
  algorithmName: PathFindAlgorithm;
}

export interface ControlActionEventClear{
  type: 'clear';
  clearObject: 'path' | 'all';
}

export interface ControlActionCreateMaze{
  type: 'createMaze';
}

export type ControlAction = ControlActionEventsRun | ControlActionEventClear | ControlActionCreateMaze;
