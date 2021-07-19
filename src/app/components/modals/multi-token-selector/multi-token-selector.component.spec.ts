import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiTokenSelectorComponent } from './multi-token-selector.component';

describe('MultiTokenSelectorComponent', () => {
  let component: MultiTokenSelectorComponent;
  let fixture: ComponentFixture<MultiTokenSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiTokenSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiTokenSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
