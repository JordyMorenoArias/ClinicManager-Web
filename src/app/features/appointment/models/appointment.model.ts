import { Patient } from '../../patient/models/patient.model';
import { User } from '../../user/models/user.model';
import { AppointmentStatusEnum } from '../enums/appointment-status.enum';

export class Appointment {
  constructor(
    public id: number,
    public patientId: number,
    public patient: Patient,
    public createdById: number,
    public lastModifiedById: number,
    public doctorId: number,
    public doctor: User,
    public appointmentDate: Date,
    public reason: string,
    public appointmentStatus: AppointmentStatusEnum,
    public createdAt: Date,
  ) {}
}
