import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineMiniComponent } from './offline-mini.component';

describe('OfflineMiniComponent', () => {
  let component: OfflineMiniComponent;
  let fixture: ComponentFixture<OfflineMiniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfflineMiniComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineMiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
