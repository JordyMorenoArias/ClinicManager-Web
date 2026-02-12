export interface AddAppointmentDto {
  patientId: number;
  doctorId: number;
  date: string;
  reason: string;
}
