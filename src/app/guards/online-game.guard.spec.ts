import { TestBed } from '@angular/core/testing';

import { OnlineGameGuard } from './online-game.guard';

describe('OnlineGameGuard', () => {
  let guard: OnlineGameGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OnlineGameGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
