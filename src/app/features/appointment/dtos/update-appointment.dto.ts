export interface UpdateAppointmentDto {
  id: number;
  patientId: number;
  doctorId: number;
  date: string;
  reason: string;
}
