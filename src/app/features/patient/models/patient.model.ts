export class Patient {
  constructor(
    public id: number,
    public fullName: string,
    public identification: string,
    public phone: string,
    public email: string,
    public address: string,
    public dateOfBirth: Date,
    public createdAt: Date,
  ) {}
}
