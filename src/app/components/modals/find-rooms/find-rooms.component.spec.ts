import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindRoomsComponent } from './find-rooms.component';

describe('FindRoomsComponent', () => {
  let component: FindRoomsComponent;
  let fixture: ComponentFixture<FindRoomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindRoomsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
