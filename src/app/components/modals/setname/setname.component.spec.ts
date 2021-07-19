import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetnameComponent } from './setname.component';

describe('SetnameComponent', () => {
  let component: SetnameComponent;
  let fixture: ComponentFixture<SetnameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetnameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetnameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
