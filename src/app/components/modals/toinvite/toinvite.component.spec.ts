import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToinviteComponent } from './toinvite.component';

describe('ToinviteComponent', () => {
  let component: ToinviteComponent;
  let fixture: ComponentFixture<ToinviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToinviteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToinviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
