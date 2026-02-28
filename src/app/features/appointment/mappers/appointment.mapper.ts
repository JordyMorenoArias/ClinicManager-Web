import { PatientMapper } from '../../patient/mappers/patient.mapper';
import { UserMapper } from '../../user/mappers/user.mapper';
import { User } from '../../user/models/user.model';
import { AppointmentDto } from '../dtos/appointment.dto';
import { AppointmentStatusEnum } from '../enums/appointment-status.enum';
import { Appointment } from '../models/appointment.model';

export class AppointmentMapper {
  public static fromDTO(dto: AppointmentDto): Appointment {
    return new Appointment(
      dto.id,
      dto.patientId,
      PatientMapper.fromDTO(dto.patient),
      dto.createdById,
      dto.lastModifiedById,
      dto.doctorId,
      UserMapper.fromDTO(dto.doctor),
      new Date(dto.date),
      dto.reason,
      dto.status as AppointmentStatusEnum,
      new Date(dto.createdAt),
    );
  }

  public static toDTO(model: Appointment): AppointmentDto {
    return {
      id: model.id,
      patientId: model.patientId,
      patient: PatientMapper.toDTO(model.patient),
      createdById: model.createdById,
      lastModifiedById: model.lastModifiedById,
      doctorId: model.doctorId,
      doctor: UserMapper.toDTO(model.doctor as User),
      date: model.date.toISOString(),
      reason: model.reason,
      status: model.status,
      createdAt: model.createdAt.toISOString(),
    };
  }
}
