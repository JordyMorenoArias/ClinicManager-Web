import { AppointmentSortByEnum } from '../enums/appointment-sort-by.enum';
import { AppointmentStatusEnum } from '../enums/appointment-status.enum';

export interface AppointmentQueryParametersDTO {
  page: number;
  pageSize: number;
  startDateFilter?: string;
  endDateFilter?: string;
  doctorId?: string;
  patientId?: string;
  appointmentStatus?: AppointmentStatusEnum;
  sortBy?: AppointmentSortByEnum;
}
