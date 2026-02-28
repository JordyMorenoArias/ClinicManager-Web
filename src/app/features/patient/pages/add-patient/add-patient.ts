import { Component, inject } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Router } from '@angular/router';
import { AddPatientDto } from '../../dtos/add-patient.dto';
import { PatientForm } from '../../components/patient-form/patient-form';

@Component({
  selector: 'app-add-patient',
  imports: [PatientForm],
  templateUrl: './add-patient.html',
  styleUrl: './add-patient.css',
})
export class AddPatient {
  private router = inject(Router);
  private patientService = inject(PatientService);

  submit(formValue: any) {
    const newPatient: AddPatientDto = {
      fullName: formValue.fullName!,
      identification: formValue.identification!,
      phone: formValue.phone!,
      email: formValue.email!,
      address: formValue.address!,
      dateOfBirth: formValue.dateOfBirth!,
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
