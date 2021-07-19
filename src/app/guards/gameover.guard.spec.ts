import { TestBed } from '@angular/core/testing';

import { GameoverGuard } from './gameover.guard';

describe('GameoverGuard', () => {
  let guard: GameoverGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GameoverGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
