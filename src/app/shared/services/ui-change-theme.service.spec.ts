import { TestBed } from '@angular/core/testing';

import { UiChangeThemeService } from './ui-change-theme.service';

describe('UiChangeThemeService', () => {
  let service: UiChangeThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiChangeThemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
