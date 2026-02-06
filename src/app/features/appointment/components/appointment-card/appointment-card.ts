import { Component, Input } from '@angular/core';
import { Appointment as appointment } from '../../models/appointment.model';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { AppointmentStatusPipe } from '../../pipes/appointment-status.pipe-pipe';
import { AppointmentStatusEnum } from '../../enums/appointment-status.enum';

@Component({
  selector: 'app-appointment-card',
  imports: [RouterModule, AppointmentStatusPipe, DatePipe, CommonModule],
  templateUrl: './appointment-card.html',
  styleUrl: './appointment-card.css',
})
export class AppointmentCard {
  appointmentStatusEnum = AppointmentStatusEnum;

  @Input()
  appointment!: appointment;
}
