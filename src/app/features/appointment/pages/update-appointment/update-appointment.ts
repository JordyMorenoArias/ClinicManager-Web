import { Component, inject, Input } from '@angular/core';
import { PatientService } from '../../../patient/services/patient.service';
import { UserService } from '../../../user/services/user.service';
import { AppointmentService } from '../../services/appointment.service';
import { Router } from '@angular/router';
import { Patient } from '../../../patient/models/patient.model';
import { User } from '../../../user/models/user.model';
import { FormControl } from '@angular/forms';
import { UserQueryParametersDTO } from '../../../user/dtos/user-query-parameters.dto';
import { debounceTime, distinctUntilChanged, map, Observable, startWith, switchMap } from 'rxjs';
import { PagedResultDTO } from '../../../../shared/dtos/paged-result.dto';
import { UserRoleEnum } from '../../../user/enums/user-role.enum';
import { UpdateAppointmentDto } from '../../dtos/update-appointment.dto';
import { DoctorSelectCard } from '../../../user/components/doctor-select-card/doctor-select-card';
import { PatientSelectCard } from '../../../patient/components/patient-select-card/patient-select-card';
import { AppointmentForm } from '../../components/appointment-form/appointment-form';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-update-appointment',
  imports: [CommonModule, AppointmentForm, PatientSelectCard, DoctorSelectCard],
  templateUrl: './update-appointment.html',
  styleUrl: './update-appointment.css',
})
export class UpdateAppointment {
  @Input()
  id!: string;

  private patientService = inject(PatientService);
  private userService = inject(UserService);
  private appointmentService = inject(AppointmentService);
  private router = inject(Router);

  selectedPatient: Patient | null = null;
  selectedDoctor: User | null = null;
  patientSearch = new FormControl('');
  doctorSearch = new FormControl('');
  appointmentDate: Date | null = null;
  appointmentTime: Date | null = null;
  reason: string = '';

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
    this.appointmentService.getAppointmentById(this.id).subscribe({
      next: (response) => {
        if (response.body) {
          console.log('Appointment details:', response.body);
          this.selectPatient(response.body.patient);
          this.selectDoctor(response.body.doctor);
          this.appointmentDate = response.body.date;
          this.appointmentTime = response.body.date;
          this.reason = response.body.reason;
        }
      },
      error: (error) => {
        this.router.navigate(['/dashboard']);
        console.error('Error fetching appointment details:', error);
      },
    });

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

    const newAppointment: UpdateAppointmentDto = {
      id: parseInt(this.id),
      patientId: formValue.patientId!,
      doctorId: formValue.doctorId!,
      date: appointmentDate.toISOString(),
      reason: formValue.reason!,
    };

    this.appointmentService.updateAppointment(newAppointment).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error updating appointment:', error);
      },
    });
  }
}
