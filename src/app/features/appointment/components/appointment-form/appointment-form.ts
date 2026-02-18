import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { Patient } from '../../../patient/models/patient.model';
import { User } from '../../../user/models/user.model';

@Component({
  selector: 'app-appointment-form',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTimepickerModule,
    MatDatepickerModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './appointment-form.html',
  styleUrl: './appointment-form.css',
})
export class AppointmentForm implements OnChanges {
  private fb = inject(FormBuilder);

  @Input({ required: true }) patientSearch!: FormControl;
  @Input({ required: true }) doctorSearch!: FormControl;
  @Input() selectedPatient: Patient | null = null;
  @Input() selectedDoctor: User | null = null;
  @Output() formValue = new EventEmitter<any>();
  @Output() searchContext = new EventEmitter<'patient' | 'doctor'>();

  ngOnChanges(): void {
    if (this.selectedPatient) {
      this.form.get('patientId')?.setValue(this.selectedPatient.id);
    }

    if (this.selectedDoctor) {
      this.form.get('doctorId')?.setValue(this.selectedDoctor.id);
    }
  }

  readonly form = this.fb.group({
    patientId: [this.selectedPatient?.id, Validators.required],
    doctorId: [this.selectedDoctor?.id, Validators.required],
    appointmentDate: [null, Validators.required],
    appointmentTime: [null, Validators.required],
    reason: ['', [Validators.maxLength(500)]],
  });

  onPatientFocus() {
    this.searchContext.emit('patient');
  }

  onDoctorFocus() {
    this.searchContext.emit('doctor');
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

    this.formValue.emit(formValue);
  }
}
