import { PatientDTO } from '../dtos/patient.dto';
import { Patient } from '../models/patient.model';

export class PatientMapper {
  public static fromDTO(dto: PatientDTO): Patient {
    return {
      id: dto.id,
      fullName: dto.fullName,
      identification: dto.identification,
      phone: dto.phone,
      email: dto.email,
      address: dto.address,
      dateOfBirth: dto.dateOfBirth,
      createdAt: dto.createdAt,
    };
  }

  public static toDTO(model: Patient): PatientDTO {
    return {
      id: model.id,
      fullName: model.fullName,
      identification: model.identification,
      phone: model.phone,
      email: model.email,
      address: model.address,
      dateOfBirth: model.dateOfBirth,
      createdAt: model.createdAt,
    };
  }
}
