import { Component, Input, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Patient } from '../../models/patient.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-patient-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './patient-card.html',
  styleUrl: './patient-card.css',
})
export class PatientCard {
  @Input()
  patient!: Patient;
}
