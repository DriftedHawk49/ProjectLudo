import { TestBed } from '@angular/core/testing';

import { WaitingGuard } from './waiting.guard';

describe('WaitingGuard', () => {
  let guard: WaitingGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(WaitingGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
