import { TestBed } from '@angular/core/testing';

import { PathMarkersService } from './path-markers.service';

describe('PathMarkersService', () => {
  let service: PathMarkersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PathMarkersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
