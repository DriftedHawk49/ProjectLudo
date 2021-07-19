import { TestBed } from '@angular/core/testing';

import { GameoverOfflineGuard } from './gameover-offline.guard';

describe('GameoverOfflineGuard', () => {
  let guard: GameoverOfflineGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GameoverOfflineGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
