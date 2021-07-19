import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineClassicComponent } from './offline-classic.component';

describe('OfflineClassicComponent', () => {
  let component: OfflineClassicComponent;
  let fixture: ComponentFixture<OfflineClassicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfflineClassicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflineClassicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
