import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, Observable, startWith, switchMap } from 'rxjs';
import { Patient } from '../../models/patient.model';
import { PagedResultDTO } from '../../../../shared/dtos/paged-result.dto';
import { PatientService } from '../../services/patient.service';
import { PatientQueryParametersDto } from '../../dtos/patient-query-parameters.dto';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { PatientCard } from '../../components/patient-card/patient-card';

@Component({
  selector: 'app-patient-list',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, Pagination, PatientCard],
  templateUrl: './patient-list.html',
  styleUrl: './patient-list.css',
})
export class PatientList implements OnInit {
  patientService = inject(PatientService);
  pagedResult$!: Observable<PagedResultDTO<Patient>>;
  patientSearch = new FormControl('');
  queryParams: PatientQueryParametersDto = {
    page: 1,
    pageSize: 9,
  };

  ngOnInit(): void {
    this.pagedResult$ = this.patientSearch.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        this.queryParams = {
          ...this.queryParams,
          searchTerm: value ?? '',
        };

        return this.patientService
          .getPatients(this.queryParams)
          .pipe(map((response) => response.body as PagedResultDTO<Patient>));
      }),
    );
  }

  onPageChange(page: number) {
    this.queryParams.page = page;
    this.loadPatients();
  }

  private loadPatients() {
    this.pagedResult$ = this.patientService
      .getPatients(this.queryParams)
      .pipe(map((response) => response.body as PagedResultDTO<Patient>));
  }
}
