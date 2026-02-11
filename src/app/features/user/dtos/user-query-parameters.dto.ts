import { UserRoleEnum } from '../enums/user-role.enum';

export interface UserQueryParametersDTO {
  page: number;
  pageSize: number;
  startDateFilter?: string;
  endDateFilter?: string;
  isActive?: boolean;
  userRole?: UserRoleEnum;
  searchTerm?: string;
}
