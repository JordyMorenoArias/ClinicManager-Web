import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AppointmentQueryParametersDTO } from '../../dtos/appointment-query-parameters.dto';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { AppointmentStatusEnum } from '../../enums/appointment-status.enum';
import { AppointmentService } from '../../services/appointment.service';
import { PagedResultDTO } from '../../../../shared/dtos/paged-result.dto';
import { Appointment } from '../../models/appointment.model';
import { AppointmentCard } from '../../components/appointment-card/appointment-card';
import { map, Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';

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
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
    status: new FormControl<AppointmentStatusEnum | null>(AppointmentStatusEnum.Pending),
  });

  ngOnInit(): void {
    if (this.formFilters.get('status')!.value) {
      this.queryParams.status = this.formFilters.get('status')!.value!;
    }

    if (this.formFilters.get('start')!.value) {
      this.queryParams.startDateFilter = this.formFilters.get('start')!.value!.toISOString();
    }

    if (this.formFilters.get('end')!.value) {
      this.queryParams.endDateFilter = this.formFilters.get('end')!.value!.toISOString();
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
      this.queryParams.startDateFilter = this.formFilters.get('start')!.value!.toISOString();
    }

    if (this.formFilters.get('end')!.value) {
      this.queryParams.endDateFilter = this.formFilters.get('end')!.value!.toISOString();
    }

    this.queryParams.page = 1;
    this.loadAppointments();
  }

  changePage(page: number): void {
    if (page < 1) return;

    this.queryParams.page = page;
    this.loadAppointments();
  }

  getPages(paged: PagedResultDTO<any>): number[] {
    const range = 5;

    const start = Math.max(paged.page - range, 1);
    const end = Math.min(paged.page + range, paged.totalPages);

    const pages: number[] = Array.from({ length: end - start + 1 }, (_, i) => start + i);

    pages[0] = 1;
    pages[pages.length - 1] = paged.totalPages;

    return pages;
  }

  private loadAppointments(): void {
    this.pagedResult$ = this.appointmentService
      .getAppointments(this.queryParams)
      .pipe(map((response) => response.body!));
  }
}
