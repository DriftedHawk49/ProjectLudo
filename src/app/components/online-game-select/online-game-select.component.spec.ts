import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineGameSelectComponent } from './online-game-select.component';

describe('OnlineGameSelectComponent', () => {
  let component: OnlineGameSelectComponent;
  let fixture: ComponentFixture<OnlineGameSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineGameSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineGameSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
