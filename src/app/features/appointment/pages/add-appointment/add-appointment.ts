import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Patient } from '../../../patient/models/patient.model';
import { User } from '../../../user/models/user.model';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
  Observable,
  startWith,
} from 'rxjs';
import { PatientService } from '../../../patient/services/patient.service';
import { UserService } from '../../../user/services/user.service';
import { UserRoleEnum } from '../../../user/enums/user-role.enum';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { AsyncPipe, CommonModule } from '@angular/common';
import { PagedResultDTO } from '../../../../shared/dtos/paged-result.dto';
import { AddAppointmentDto } from '../../dtos/add-appointment.dto';
import { AppointmentService } from '../../services/appointment.service';
import { Router } from '@angular/router';
import { UserQueryParametersDTO } from '../../../user/dtos/user-query-parameters.dto';

@Component({
  selector: 'app-add-appointment',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTimepickerModule,
    MatDatepickerModule,
    FormsModule,
    AsyncPipe,
    CommonModule,
  ],
  templateUrl: './add-appointment.html',
  styleUrl: './add-appointment.css',
})
export class AddAppointment implements OnInit {
  private patientService = inject(PatientService);
  private userService = inject(UserService);
  private appointmentService = inject(AppointmentService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  readonly form = this.fb.group({
    patientId: ['', Validators.required],
    doctorId: ['', Validators.required],
    appointmentDate: [null, Validators.required],
    appointmentTime: [null, Validators.required],
    reason: ['', [Validators.maxLength(500)]],
  });

  patientSearch = new FormControl('');
  doctorSearch = new FormControl('');
  selectedPatientId: string | null = null;
  selectedDoctorId: string | null = null;

  activeSearch: 'patient' | 'doctor' = 'patient';
  patientPlaceholder = 'Patient';
  doctorPlaceholder = 'Doctor';

  appointmentDateTime$ = new Observable<Date | null>();

  patientQueryParameters: UserQueryParametersDTO = {
    page: 1,
    pageSize: 4,
  };
  userQueryParameters: UserQueryParametersDTO = {
    page: 1,
    pageSize: 4,
    userRole: UserRoleEnum.doctor,
  };
  patientsResult$!: Observable<PagedResultDTO<Patient> | null>;
  doctorsResult$!: Observable<PagedResultDTO<User> | null>;

  ngOnInit() {
    this.patientsResult$ = this.patientSearch.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.activeSearch = 'patient';
        this.patientQueryParameters.searchTerm = this.patientSearch.value ?? '';
      }),
      switchMap((searchTerm) => {
        return this.patientService.getPatients(this.patientQueryParameters);
      }),
      map((result) => result.body),
    );

    this.doctorsResult$ = this.doctorSearch.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.activeSearch = 'doctor';
        this.userQueryParameters.searchTerm = this.doctorSearch.value ?? '';
      }),
      switchMap((searchTerm) => {
        return this.userService.getUsers(this.userQueryParameters);
      }),
      map((result) => result.body),
    );
  }

  selectPatient(patient: Patient) {
    this.patientSearch.setValue(patient.fullName, { emitEvent: false });
    this.form.get('patientId')?.setValue(patient.id.toString());
    this.selectedPatientId = patient.id.toString();
    this.patientPlaceholder = patient.fullName;
  }

  selectDoctor(doctor: User) {
    this.doctorSearch.setValue(doctor.fullName, { emitEvent: false });
    this.form.get('doctorId')?.setValue(doctor.id.toString());
    this.selectedDoctorId = doctor.id.toString();
    this.doctorPlaceholder = doctor.fullName;
  }

  submitted = false;

  isInvalid(controlName?: string): boolean {
    if (!controlName) {
      return this.form.invalid && (this.form.touched || this.submitted);
    }

    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.touched || this.submitted));
  }

  submit() {
    this.submitted = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;

    if (!formValue.appointmentDate || !formValue.appointmentTime) {
      return;
    }

    const date = formValue.appointmentDate as Date;
    const time = formValue.appointmentTime as Date;

    const appointmentDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
      0,
      0,
    );

    console.log('Local:', appointmentDate);
    console.log('ISO:', appointmentDate.toISOString());

    const newAppointment: AddAppointmentDto = {
      patientId: formValue.patientId!,
      doctorId: formValue.doctorId!,
      date: appointmentDate.toISOString(),
      reason: formValue.reason!,
    };

    this.appointmentService.addAppointment(newAppointment).subscribe({
      next: (response) => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error adding appointment:', error);
        this.submitted = false;
      },
    });
  }
}
