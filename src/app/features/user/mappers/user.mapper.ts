import { UserDTO } from '../dtos/user.dto';
import { User } from '../models/user.dto';

export class UserMapper {
  public static fromDTO(dto: UserDTO): User {
    return {
      id: dto.id,
      fullName: dto.fullName,
      username: dto.username,
      email: dto.email,
      phoneNumber: dto.phoneNumber,
      isActive: dto.isActive,
    };
  }

  public static toDTO(user: User): UserDTO {
    return {
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isActive: user.isActive,
    };
  }
}
