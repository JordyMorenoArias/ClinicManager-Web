import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-patient-form',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  templateUrl: './patient-form.html',
  styleUrl: './patient-form.css',
})
export class PatientForm {
  private fb = inject(FormBuilder);
  @Output() formSubmit = new EventEmitter<any>();

  readonly form = this.fb.group({
    fullName: ['', Validators.required],
    identification: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', Validators.required],
    address: ['', Validators.required],
    dateOfBirth: ['', Validators.required],
  });

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

    this.formSubmit.emit(this.form.value);
  }
}
