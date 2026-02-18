import { Component, Input } from '@angular/core';
import { Patient } from '../../models/patient.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-patient-select-card',
  imports: [DatePipe],
  templateUrl: './patient-select-card.html',
  styleUrl: './patient-select-card.css',
})
export class PatientSelectCard {
  @Input({ required: true })
  patient!: Patient;

  @Input()
  selectedPatientId?: number | null = null;
}
