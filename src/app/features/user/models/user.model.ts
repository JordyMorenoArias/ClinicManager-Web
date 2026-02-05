export class User {
  constructor(
    public id: number,
    public fullName: string,
    public username: string,
    public email: string,
    public phoneNumber: string,
    public isActive: boolean,
  ) {}
}
