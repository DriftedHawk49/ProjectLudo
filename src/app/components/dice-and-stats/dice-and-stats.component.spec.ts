import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiceAndStatsComponent } from './dice-and-stats.component';

describe('DiceAndStatsComponent', () => {
  let component: DiceAndStatsComponent;
  let fixture: ComponentFixture<DiceAndStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiceAndStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiceAndStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
