import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorSelectCard } from './doctor-select-card';

describe('DoctorSelectCard', () => {
  let component: DoctorSelectCard;
  let fixture: ComponentFixture<DoctorSelectCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorSelectCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorSelectCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
