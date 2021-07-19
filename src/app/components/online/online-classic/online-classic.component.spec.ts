import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineClassicComponent } from './online-classic.component';

describe('OnlineClassicComponent', () => {
  let component: OnlineClassicComponent;
  let fixture: ComponentFixture<OnlineClassicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnlineClassicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnlineClassicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
