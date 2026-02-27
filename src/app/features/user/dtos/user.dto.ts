import { DoctorProfileDTO } from '../../doctor-profile/dtos/doctor-profile.dto';

export interface UserDTO {
  id: number;
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  isActive: boolean;
  doctorProfiles: DoctorProfileDTO[];
}
