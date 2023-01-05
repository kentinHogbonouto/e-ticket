export interface TokenPayload {
  userId: string;
  userType: UserType;
}

export enum UserType {
  ADMIN = "ADMIN",
  ORGANIZER = "ORGANIZER",
  USER = "USER",
}
