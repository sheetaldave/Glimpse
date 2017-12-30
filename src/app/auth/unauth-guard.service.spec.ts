import { TestBed, inject } from '@angular/core/testing';

import { UnauthGuard } from './unauth-guard.service';

describe('UnauthGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UnauthGuard]
    });
  });

  it('should be created', inject([UnauthGuard], (service: UnauthGuard) => {
    expect(service).toBeTruthy();
  }));
});
