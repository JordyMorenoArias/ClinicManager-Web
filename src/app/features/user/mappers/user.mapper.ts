import { DoctorProfileMapper } from '../../doctor-profile/mappers/doctor-profile.mapper';
import { UserDTO } from '../dtos/user.dto';
import { User } from '../models/user.model';

export class UserMapper {
  public static fromDTO(dto: UserDTO): User {
    return new User(
      dto.id,
      dto.fullName,
      dto.username,
      dto.email,
      dto.phoneNumber,
      dto.isActive,
      dto.doctorProfiles?.map((dp) => DoctorProfileMapper.fromDTO(dp)) ?? [],
    );
  }

  public static toDTO(user: User): UserDTO {
    return {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isActive: user.isActive,
      doctorProfiles: user.doctorProfiles.map((dp) => DoctorProfileMapper.toDTO(dp)),
    };
  }
}
