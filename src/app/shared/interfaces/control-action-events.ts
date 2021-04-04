export interface ControlActionEventsRun{
  type: 'findPath';
  algorithmName: string;
}

export interface ControlActionEventClear{
  type: 'clear';
  clearObject: 'path' | 'all';
}
