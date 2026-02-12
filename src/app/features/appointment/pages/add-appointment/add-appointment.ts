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
  private fb = inject(FormBuilder);

  readonly form = this.fb.group({
    patientId: ['', Validators.required],
    doctorId: ['', Validators.required],
    appointmentDate: [null, Validators.required],
    appointmentTime: [null, Validators.required],
    reason: ['', [Validators.required, Validators.maxLength(500)]],
  });

  patientSearch = new FormControl('');
  doctorSearch = new FormControl('');
  selectedPatientId: string | null = null;
  selectedDoctorId: string | null = null;

  activeSearch: 'patient' | 'doctor' = 'patient';
  patientPlaceholder = 'Patient';
  doctorPlaceholder = 'Doctor';

  appointmentDateTime$ = new Observable<Date | null>();
  patientsResult$!: Observable<PagedResultDTO<Patient> | null>;
  doctorsResult$!: Observable<PagedResultDTO<User> | null>;

  ngOnInit() {
    this.appointmentDateTime$ = this.form.valueChanges.pipe(
      map(({ appointmentDate, appointmentTime }) => {
        if (!appointmentDate || !appointmentTime) return null;

        const date = new Date(appointmentDate);
        const time = new Date(appointmentTime);

        date.setHours(time.getHours(), time.getMinutes(), 0, 0);
        return date;
      }),
    );

    this.patientsResult$ = this.patientSearch.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.activeSearch = 'patient';
      }),
      switchMap((searchTerm) => {
        return this.patientService.getPatients({
          page: 1,
          pageSize: 4,
          searchTerm: searchTerm ?? '',
        });
      }),
      map((result) => result.body),
    );

    this.doctorsResult$ = this.doctorSearch.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.activeSearch = 'doctor';
      }),
      switchMap((searchTerm) => {
        return this.userService.getUsers({
          page: 1,
          pageSize: 4,
          searchTerm: searchTerm ?? '',
          userRole: UserRoleEnum.doctor,
        });
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

  isInvalid(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.touched || this.submitted));
  }

  submit() {
    this.submitted = true;

    if (this.form.valid) {
      this.form.markAllAsTouched();
    }

    // logic to submit the form data to the server would go here
  }
}
