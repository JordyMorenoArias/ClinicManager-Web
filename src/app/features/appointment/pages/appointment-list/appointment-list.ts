import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AppointmentQueryParametersDTO } from '../../dtos/appointment-query-parameters.dto';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AppointmentStatusEnum } from '../../enums/appointment-status.enum';
import { AppointmentService } from '../../services/appointment.service';
import { PagedResultDTO } from '../../../../shared/dtos/paged-result.dto';
import { Appointment } from '../../models/appointment.model';
import { AppointmentCard } from '../../components/appointment-card/appointment-card';
import { Patient } from '../../../patient/models/patient.model';
import { User } from '../../../user/models/user.model';

@Component({
  selector: 'app-appointment-list',
  imports: [
    RouterModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    AppointmentCard,
  ],
  templateUrl: './appointment-list.html',
  styleUrl: './appointment-list.css',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentList implements OnInit {
  AppointmentStatusEnum = AppointmentStatusEnum;
  private appointmentService = inject(AppointmentService);
  private fb = inject(FormBuilder);
  pagedResult: PagedResultDTO<Appointment> | null = null;
  private queryParams: AppointmentQueryParametersDTO = {
    page: 1,
    pageSize: 10,
  };

  formFilters = this.fb.group({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
    status: new FormControl<AppointmentStatusEnum | null>(AppointmentStatusEnum.Pending),
  });

  ngOnInit(): void {
    const statusValue = this.formFilters.get('status')!.value;
    if (statusValue !== null) {
      this.queryParams.appointmentStatus = statusValue;
    }

    if (this.formFilters.get('start')!.value) {
      this.queryParams.startDateFilter = this.formFilters.get('start')!.value!.toISOString();
    }

    if (this.formFilters.get('end')!.value) {
      this.queryParams.endDateFilter = this.formFilters.get('end')!.value!.toISOString();
    }

    this.appointmentService.getAppointments(this.queryParams).subscribe({
      next: (response) => {
        this.pagedResult = response.body;
        console.log('Appointments loaded', this.pagedResult);
      },
      error: (error) => {
        console.error('Error loading appointments', error);
      },
    });
  }
}
