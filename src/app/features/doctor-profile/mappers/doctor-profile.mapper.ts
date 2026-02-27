import { DoctorProfileDTO } from '../dtos/doctor-profile.dto';
import { DoctorProfile } from '../models/doctor-profile.model';

export class DoctorProfileMapper {
  public static fromDTO(dto: DoctorProfileDTO): DoctorProfile {
    return new DoctorProfile(
      dto.id,
      dto.doctorId,
      dto.specialty,
      dto.description,
      dto.yearsOfExperience,
      dto.licenseNumber,
      new Date(dto.createdAt),
    );
  }

  public static toDTO(model: DoctorProfile): DoctorProfileDTO {
    return {
      id: model.id,
      doctorId: model.doctorId,
      specialty: model.specialty,
      description: model.description,
      yearsOfExperience: model.yearsOfExperience,
      licenseNumber: model.licenseNumber,
      createdAt: model.createdAt.toISOString(),
    };
  }
}
