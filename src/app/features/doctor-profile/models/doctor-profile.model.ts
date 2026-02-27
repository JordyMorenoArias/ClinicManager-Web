export class DoctorProfile {
  constructor(
    public id: number,
    public doctorId: number,
    public specialty: string,
    public description: string,
    public yearsOfExperience: number,
    public licenseNumber: string,
    public createdAt: Date,
  ) {}
}
