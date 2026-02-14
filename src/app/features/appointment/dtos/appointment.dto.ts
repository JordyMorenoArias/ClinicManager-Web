import { PatientDTO } from '../../patient/dtos/patient.dto';
import { UserDTO } from '../../user/dtos/user.dto';

export interface AppointmentDto {
  id: number;
  patientId: number;
  patient: PatientDTO;
  createdById: number;
  lastModifiedById: number;
  doctorId: number;
  doctor: UserDTO;
  date: string;
  reason: string;
  status: number;
  createdAt: string;
}
