import { UserDTO } from '../../user/dtos/user.dto';

export interface DoctorProfileDTO {
  id: number;
  doctorId: number;
  specialty: string;
  description: string;
  yearsOfExperience: number;
  licenseNumber: string;
  createdAt: string;
}
