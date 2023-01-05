export interface Users {
  id: string;
  lastName: string;
  firstName: string;
  email: string;
  password?: string;
  resetToken?: string;
  resetTokenExpiration?: Date;
  resetPasswordRequestId?: string;
}
