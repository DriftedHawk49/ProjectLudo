import { TestBed } from '@angular/core/testing';

import { OfflineGameGuard } from './offline-game.guard';

describe('OfflineGameGuard', () => {
  let guard: OfflineGameGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OfflineGameGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
