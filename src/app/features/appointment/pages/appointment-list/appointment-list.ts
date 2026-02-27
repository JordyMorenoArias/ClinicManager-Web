import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AppointmentQueryParametersDTO } from '../../dtos/appointment-query-parameters.dto';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AppointmentStatusEnum } from '../../enums/appointment-status.enum';
import { AppointmentService } from '../../services/appointment.service';
import { PagedResultDTO } from '../../../../shared/dtos/paged-result.dto';
import { Appointment } from '../../models/appointment.model';
import { AppointmentCard } from '../../components/appointment-card/appointment-card';
import { map, Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Pagination } from '../../../../shared/components/pagination/pagination';

@Component({
  selector: 'app-appointment-list',
  imports: [
    CommonModule,
    AsyncPipe,
    RouterModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    AppointmentCard,
    AsyncPipe,
    Pagination,
  ],
  templateUrl: './appointment-list.html',
  styleUrl: './appointment-list.css',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentList implements OnInit {
  private appointmentService = inject(AppointmentService);
  private fb = inject(FormBuilder);
  queryParams: AppointmentQueryParametersDTO = {
    page: 1,
    pageSize: 8,
  };

  appointmentStatusEnum = AppointmentStatusEnum;
  pagedResult$!: Observable<PagedResultDTO<Appointment>>;

  formFilters = this.fb.group({
    start: [null],
    end: [null],
    status: [AppointmentStatusEnum.Pending],
  });

  ngOnInit(): void {
    if (this.formFilters.get('status')!.value) {
      this.queryParams.status = this.formFilters.get('status')!.value!;
    }

    if (this.formFilters.get('start')!.value) {
      this.queryParams.startDateFilter = this.formFilters.get('start')!.value!;
    }

    if (this.formFilters.get('end')!.value) {
      this.queryParams.endDateFilter = this.formFilters.get('end')!.value!;
    }

    this.loadAppointments();
  }

  changeFilter(): void {
    const status = this.formFilters.get('status')!.value;
    if (status) {
      this.queryParams.status = status;
    } else {
      delete this.queryParams.status;
    }

    if (this.formFilters.get('start')!.value) {
      this.queryParams.startDateFilter = this.formFilters.get('start')!.value!;
    }

    if (this.formFilters.get('end')!.value) {
      this.queryParams.endDateFilter = this.formFilters.get('end')!.value!;
    }

    this.queryParams.page = 1;
    this.loadAppointments();
  }

  onPageChange(page: number) {
    this.queryParams.page = page;
    this.loadAppointments();
  }

  private loadAppointments(): void {
    this.pagedResult$ = this.appointmentService
      .getAppointments(this.queryParams)
      .pipe(map((response) => response.body!));
  }
}
