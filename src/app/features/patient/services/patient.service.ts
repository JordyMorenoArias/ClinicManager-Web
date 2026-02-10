import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PatientQueryParametersDto } from '../dtos/patient-query-parameters.dto';
import { map, Observable } from 'rxjs';
import { PagedResultDTO } from '../../../shared/dtos/paged-result.dto';
import { Patient } from '../models/patient.model';
import { environment } from '../../../../environments/environment.development';
import { PatientMapper } from '../mappers/patient.mapper';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  public getPatients(
    queryParams: PatientQueryParametersDto,
  ): Observable<HttpResponse<PagedResultDTO<Patient>>> {
    return this.http
      .get<PagedResultDTO<Patient>>(this.apiUrl + '/patient', {
        params: queryParams as any,
        observe: 'response',
        withCredentials: true,
      })
      .pipe(
        map((response: HttpResponse<PagedResultDTO<Patient>>) => {
          if (!response.body) {
            throw new Error('Login response body is null');
          }

          const mappedBody: PagedResultDTO<Patient> = {
            ...response.body,
            items: response.body.items.map((item) => PatientMapper.fromDTO(item)),
          };
          return response.clone({ body: mappedBody });
        }),
      );
  }
}
