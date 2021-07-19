import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineMiniComponent } from './online-mini.component';

describe('OnlineMiniComponent', () => {
  let component: OnlineMiniComponent;
  let fixture: ComponentFixture<OnlineMiniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineMiniComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineMiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
