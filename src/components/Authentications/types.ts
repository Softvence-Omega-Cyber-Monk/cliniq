
export enum Role {
  INDIVIDUAL = 'INDIVIDUAL_THERAPIST',
  PRIVATE_PRACTICE = 'CLINIC',
  THERAPIST = 'THERAPIST',
}
export interface User {
  id: string;
  email: string;
  fullName: string;
  clinicId: string | null;
  stripeCustomerId: string | null;
}

export type UserType = "THERAPIST" | "CLINIC" | "INDIVIDUAL_THERAPIST" | string;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
  userType: UserType;
}
