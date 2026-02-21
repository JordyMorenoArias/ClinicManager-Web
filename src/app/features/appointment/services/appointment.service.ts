import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { AppointmentQueryParametersDTO } from '../dtos/appointment-query-parameters.dto';
import { map, Observable } from 'rxjs';
import { PagedResultDTO } from '../../../shared/dtos/paged-result.dto';
import { Appointment } from '../models/appointment.model';
import { AppointmentDto } from '../dtos/appointment.dto';
import { AppointmentMapper } from '../mappers/appointment.mapper';
import { AddAppointmentDto } from '../dtos/add-appointment.dto';
import { UpdateAppointmentDto } from '../dtos/update-appointment.dto';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  getAppointmentById(id: string): Observable<HttpResponse<Appointment>> {
    return this.http
      .get<AppointmentDto>(`${this.apiUrl}/appointment/${id}`, {
        observe: 'response',
        withCredentials: true,
      })
      .pipe(
        map((response: HttpResponse<AppointmentDto>) => {
          if (!response.body) {
            throw new Error('Get appointment by id response body is null');
          }

          const mappedBody: Appointment = AppointmentMapper.fromDTO(response.body);
          return response.clone({ body: mappedBody });
        }),
      );
  }

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
            throw new Error('Get appointments response body is null');
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

  addAppointment(newAppointment: AddAppointmentDto): Observable<HttpResponse<Appointment>> {
    return this.http
      .post<AppointmentDto>(this.apiUrl + '/appointment', newAppointment, {
        observe: 'response',
        withCredentials: true,
      })
      .pipe(
        map((response: HttpResponse<AppointmentDto>) => {
          if (!response.body) {
            throw new Error('Add appointment response body is null');
          }

          const mappedBody: Appointment = AppointmentMapper.fromDTO(response.body);
          return response.clone({ body: mappedBody });
        }),
      );
  }

  updateAppointment(
    updatedappointment: UpdateAppointmentDto,
  ): Observable<HttpResponse<Appointment>> {
    return this.http
      .put<AppointmentDto>(
        this.apiUrl + `/appointment/${updatedappointment.id}`,
        updatedappointment,
        {
          observe: 'response',
          withCredentials: true,
        },
      )
      .pipe(
        map((response: HttpResponse<AppointmentDto>) => {
          if (!response.body) {
            throw new Error('Update appointment response body is null');
          }

          const mappedBody: Appointment = AppointmentMapper.fromDTO(response.body);
          return response.clone({ body: mappedBody });
        }),
      );
  }
}
