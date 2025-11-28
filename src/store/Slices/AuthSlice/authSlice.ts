import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  fullName: string;
  licenseNumber: string;
  qualification: string;
  email: string;
  photoUrl: string;
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
  userType: "THERAPIST" | "ADMIN" | "INDIVIDUAL_THERAPIST" | "CLINIC";
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  userType?: "THERAPIST" | "ADMIN" | "INDIVIDUAL_THERAPIST" | "CLINIC" | null;
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
        userType: "THERAPIST" | "ADMIN" | "INDIVIDUAL_THERAPIST" | "CLINIC";
      }>
    ) => {
      state.user = action.payload.user;
      state.userType = action.payload.userType;
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      // ✅ Removed localStorage.setItem - redux-persist handles this
    },
    setToken: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      // ✅ Removed localStorage.setItem - redux-persist handles this
    },
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logOut: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.userType = null;
      // ✅ Removed localStorage.removeItem - redux-persist handles this
    },
  },
});

export const { login, logOut, setCredentials, setToken } = authSlice.actions;
export default authSlice.reducer;