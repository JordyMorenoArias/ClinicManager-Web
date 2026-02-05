import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AppointmentQueryParametersDTO } from '../dtos/appointment-query-parameters.dto';
import { map, Observable } from 'rxjs';
import { PagedResultDTO } from '../../../shared/dtos/paged-result.dto';
import { Appointment } from '../models/appointment.model';
import { AppointmentDto } from '../dtos/appointment.dto';
import { AppointmentMapper } from '../mappers/appointment.mapper';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAppointments(
    queryParams: AppointmentQueryParametersDTO,
  ): Observable<HttpResponse<PagedResultDTO<Appointment>>> {
    return this.http
      .get<PagedResultDTO<AppointmentDto>>(this.apiUrl + '/appointment', {
        params: queryParams as any,
        observe: 'response',
        withCredentials: true,
      })
      .pipe(
        map((response: HttpResponse<PagedResultDTO<AppointmentDto>>) => {
          if (!response.body) {
            throw new Error('Login response body is null');
          }

          // Map each AppointmentDto to Appointment
          const mappedBody: PagedResultDTO<Appointment> = {
            ...response.body,
            items: response.body.items.map((item) => AppointmentMapper.fromDTO(item)),
          };

          return response.clone({ body: mappedBody });
        }),
      );
  }
}
