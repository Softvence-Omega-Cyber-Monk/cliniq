import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface User {
  user: User
  id: string;
  fullName: string;
  licenseNumber: string;
  qualification: string;
  email: string;
  phone: string;
  speciality: string;
  defaultSessionDuration: number;
  timeZone: string;
  availabilityStartTime: string | null;
  availabilityEndTime: string | null;
  clinicId: string | null;
  clinic: string | null;
  subscriptionPlan: string | null;
  createdAt: string;
  userType: "THERAPIST" | "ADMIN" | "PRIVATE_PRACTICE";
  updatedAt: string;
}
interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  userType: "THERAPIST" | "ADMIN" | "PRIVATE_PRACTICE" | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  userType: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
        refreshToken?: string;
      }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      localStorage.setItem("token", action.payload.accessToken);
    },
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.userType = null;
      localStorage.removeItem("token");
    },
  },
});

export const { login, logout, setCredentials } = authSlice.actions;
export default authSlice.reducer; 