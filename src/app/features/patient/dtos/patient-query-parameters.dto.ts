export interface PatientQueryParametersDto {
  page?: number;
  pageSize?: number;
  startDateFilter?: string;
  endDateFilter?: string;
  dateOfBirth?: string;
  searchTerm?: string;
}
