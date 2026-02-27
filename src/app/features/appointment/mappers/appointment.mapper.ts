import { User } from '../../user/models/user.model';
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
      new User(
        dto.doctor.id,
        dto.doctor.fullName,
        dto.doctor.username,
        dto.doctor.email,
        dto.doctor.phoneNumber,
        dto.doctor.isActive,
        (dto.doctor.doctorProfiles || []).map((profile) => ({
          ...profile,
          createdAt: new Date(profile.createdAt),
        })),
      ),
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
      patient: model.patient,
      createdById: model.createdById,
      lastModifiedById: model.lastModifiedById,
      doctorId: model.doctorId,
      doctor: {
        ...model.doctor,
        doctorProfiles: (model.doctor.doctorProfiles || []).map((profile) => ({
          ...profile,
          createdAt:
            profile.createdAt instanceof Date ? profile.createdAt.toISOString() : profile.createdAt,
        })),
      },
      date: model.date.toISOString(),
      reason: model.reason,
      status: model.appointmentStatus,
      createdAt: model.createdAt.toISOString(),
    };
  }
}
