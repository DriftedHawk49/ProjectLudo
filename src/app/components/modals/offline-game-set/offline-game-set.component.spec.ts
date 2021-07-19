import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineGameSetComponent } from './offline-game-set.component';

describe('OfflineGameSetComponent', () => {
  let component: OfflineGameSetComponent;
  let fixture: ComponentFixture<OfflineGameSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfflineGameSetComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineGameSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
