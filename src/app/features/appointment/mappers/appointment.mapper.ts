import { AppointmentDto } from '../dtos/appointment.dto';
import { AppointmentStatusEnum } from '../enums/appointment-status.enum';
import { Appointment } from '../models/appointment.model';

export class AppointmentMapper {
  public static fromDTO(dto: AppointmentDto): Appointment {
    return new Appointment(
      dto.id,
      dto.patientId,
      dto.patient,
      dto.createdById,
      dto.lastModifiedById,
      dto.doctorId,
      dto.doctor,
      new Date(dto.appointmentDate),
      dto.reason,
      dto.status as AppointmentStatusEnum,
      new Date(dto.createdAt),
    );
  }

  public static toDTO(model: Appointment): AppointmentDto {
    return {
      id: model.id,
      patientId: model.patientId,
      patient: model.patient,
      createdById: model.createdById,
      lastModifiedById: model.lastModifiedById,
      doctorId: model.doctorId,
      doctor: model.doctor,
      appointmentDate: model.appointmentDate.toISOString(),
      reason: model.reason,
      status: model.appointmentStatus,
      createdAt: model.createdAt.toISOString(),
    };
  }
}
