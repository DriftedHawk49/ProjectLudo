import { TestBed } from '@angular/core/testing';

import { OnlineManagerService } from './online-manager.service';

describe('OnlineManagerService', () => {
  let service: OnlineManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OnlineManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
