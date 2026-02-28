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
import { AppointmentFormData } from '../../models/appointment-form-data.model';
import { MatSelectModule } from '@angular/material/select';

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
    MatSelectModule,
  ],
  templateUrl: './appointment-form.html',
  styleUrl: './appointment-form.css',
})
export class AppointmentForm implements OnChanges {
  private fb = inject(FormBuilder);

  @Input({ required: true }) patientSearch!: FormControl;
  @Input({ required: true }) doctorSearch!: FormControl;
  @Input() initialData?: AppointmentFormData;
  @Output() formValue = new EventEmitter<any>();
  @Output() searchContext = new EventEmitter<'patient' | 'doctor'>();

  ngOnChanges(): void {
    if (!this.initialData) return;

    this.form.patchValue({
      patientId: this.initialData.patient?.id,
      doctorId: this.initialData.doctor?.id,
      appointmentDate: this.initialData.appointmentDate,
      appointmentTime: this.initialData.appointmentTime,
      reason: this.initialData.reason,
      status: this.initialData.status,
    });
  }

  readonly form = this.fb.group({
    patientId: [this.initialData?.patient?.id, Validators.required],
    doctorId: [this.initialData?.doctor?.id, Validators.required],
    appointmentDate: [this.initialData?.appointmentDate, Validators.required],
    appointmentTime: [this.initialData?.appointmentTime, Validators.required],
    reason: [this.initialData?.reason, [Validators.maxLength(500)]],
    status: [this.initialData?.status, Validators.required],
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
