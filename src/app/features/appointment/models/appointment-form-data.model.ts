import { Patient } from '../../patient/models/patient.model';
import { User } from '../../user/models/user.model';
import { AppointmentStatusEnum } from '../enums/appointment-status.enum';

export interface AppointmentFormData {
  patient: Patient | null;
  doctor: User | null;
  appointmentDate?: Date | null;
  appointmentTime?: Date | null;
  reason?: string;
  status?: AppointmentStatusEnum;
}
