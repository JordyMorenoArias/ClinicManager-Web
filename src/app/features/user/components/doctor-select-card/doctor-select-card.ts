import { Component, Input } from '@angular/core';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-doctor-select-card',
  imports: [CommonModule],
  templateUrl: './doctor-select-card.html',
  styleUrl: './doctor-select-card.css',
})
export class DoctorSelectCard {
  @Input({ required: true })
  doctor!: User;

  @Input()
  selectedDoctorId?: string | null = null;
}
