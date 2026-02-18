import { Component, inject } from '@angular/core';
import { Patient } from '../../../patient/models/patient.model';
import { User } from '../../../user/models/user.model';
import { debounceTime, distinctUntilChanged, map, Observable, startWith, switchMap } from 'rxjs';
import { PatientService } from '../../../patient/services/patient.service';
import { UserService } from '../../../user/services/user.service';
import { UserRoleEnum } from '../../../user/enums/user-role.enum';
import { CommonModule } from '@angular/common';
import { PagedResultDTO } from '../../../../shared/dtos/paged-result.dto';
import { AddAppointmentDto } from '../../dtos/add-appointment.dto';
import { AppointmentService } from '../../services/appointment.service';
import { Router } from '@angular/router';
import { UserQueryParametersDTO } from '../../../user/dtos/user-query-parameters.dto';
import { PatientSelectCard } from '../../../patient/components/patient-select-card/patient-select-card';
import { DoctorSelectCard } from '../../../user/components/doctor-select-card/doctor-select-card';
import { AppointmentForm } from '../../components/appointment-form/appointment-form';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-appointment',
  imports: [CommonModule, AppointmentForm, PatientSelectCard, DoctorSelectCard],
  templateUrl: './add-appointment.html',
  styleUrl: './add-appointment.css',
})
export class AddAppointment {
  private patientService = inject(PatientService);
  private userService = inject(UserService);
  private appointmentService = inject(AppointmentService);
  private router = inject(Router);

  selectedPatient: Patient | null = null;
  selectedDoctor: User | null = null;
  patientSearch = new FormControl('');
  doctorSearch = new FormControl('');

  searchContext: 'patient' | 'doctor' = 'patient';

  appointmentDateTime$ = new Observable<Date | null>();

  patientQueryParameters: UserQueryParametersDTO = {
    page: 1,
    pageSize: 4,
  };

  userQueryParameters: UserQueryParametersDTO = {
    page: 1,
    pageSize: 4,
  };

  patientsResult$!: Observable<PagedResultDTO<Patient> | null>;
  doctorsResult$!: Observable<PagedResultDTO<User> | null>;

  ngOnInit() {
    this.patientsResult$ = this.patientSearch.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        this.patientQueryParameters = {
          ...this.patientQueryParameters,
          searchTerm: value ?? '',
        };

        return this.patientService
          .getPatients(this.patientQueryParameters)
          .pipe(map((result) => result.body));
      }),
    );

    this.doctorsResult$ = this.doctorSearch.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        this.userQueryParameters = {
          ...this.userQueryParameters,
          searchTerm: value ?? '',
          userRole: UserRoleEnum.doctor,
        };

        return this.userService
          .getUsers(this.userQueryParameters)
          .pipe(map((result) => result.body));
      }),
    );
  }

  patientSearchChange(value: string | null) {
    this.patientQueryParameters = {
      ...this.patientQueryParameters,
      searchTerm: value ?? '',
      page: 1,
    };

    this.patientsResult$ = this.patientService
      .getPatients(this.patientQueryParameters)
      .pipe(map((result) => result.body));
  }

  doctorSearchChange(value: string | null) {
    this.userQueryParameters = {
      ...this.userQueryParameters,
      searchTerm: value ?? '',
      page: 1,
    };

    this.doctorsResult$ = this.userService
      .getUsers(this.userQueryParameters)
      .pipe(map((result) => result.body));
  }

  changeSearchContext(type: 'patient' | 'doctor') {
    this.searchContext = type;
  }

  selectPatient(patient: Patient) {
    this.patientSearch.setValue(patient.fullName);
    this.selectedPatient = patient;
  }

  selectDoctor(doctor: User) {
    this.doctorSearch.setValue(doctor.fullName);
    this.selectedDoctor = doctor;
  }

  submit(formValue: any) {
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

    const newAppointment: AddAppointmentDto = {
      patientId: formValue.patientId!,
      doctorId: formValue.doctorId!,
      date: appointmentDate.toISOString(),
      reason: formValue.reason!,
    };

    this.appointmentService.addAppointment(newAppointment).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error adding appointment:', error);
      },
    });
  }
}
