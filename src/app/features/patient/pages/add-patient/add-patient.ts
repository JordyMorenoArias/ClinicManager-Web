import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PatientService } from '../../services/patient.service';
import { Router } from '@angular/router';
import { AddPatientDto } from '../../dtos/add-patient.dto';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-patient',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
  ],
  templateUrl: './add-patient.html',
  styleUrl: './add-patient.css',
})
export class AddPatient {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private patientService = inject(PatientService);

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

    const newPatient: AddPatientDto = {
      fullName: this.form.value.fullName!,
      identification: this.form.value.identification!,
      phone: this.form.value.phone!,
      email: this.form.value.email!,
      address: this.form.value.address!,
      dateOfBirth: this.form.value.dateOfBirth!,
    };

    this.patientService.addPatient(newPatient).subscribe({
      next: () => {
        this.router.navigate(['/patients']);
      },
      error: (error) => {
        console.error('Error adding patient:', error);
      },
    });
  }
}
