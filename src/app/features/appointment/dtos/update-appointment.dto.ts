import { AppointmentStatusEnum } from '../enums/appointment-status.enum';

export interface UpdateAppointmentDto {
  id: number;
  patientId: number;
  doctorId: number;
  date: string;
  reason: string;
  status: AppointmentStatusEnum;
}
