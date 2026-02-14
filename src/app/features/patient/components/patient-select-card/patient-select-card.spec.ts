import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientSelectCard } from './patient-select-card';

describe('PatientSelectCard', () => {
  let component: PatientSelectCard;
  let fixture: ComponentFixture<PatientSelectCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientSelectCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientSelectCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
