import baseApi from "./BaseApi/BaseApi";

// ==================== TYPES ====================

export interface SecuritySettings {
  twoFactorAuth: boolean;
  passwordMinLength: number;
  passwordExpiration: number;
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
}

export interface SystemSettings {
  platformName: string;
  supportEmail: string;
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  defaultTimezone: string;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  notifyOnNewUser: boolean;
  notifyOnFailedPayment: boolean;
  notifyOnSupportTicket: boolean;
}

export interface LoginHistoryEntry {
  userId: string;
  user: string;
  email: string;
  userType: string;
  lastLogin: string;
  status: "Active" | "Inactive";
  timestamp: Date;
}

export interface UpdateSecuritySettingsDto {
  twoFactorAuth?: boolean;
  sessionTimeout?: number;
  maxLoginAttempts?: number;
  lockoutDuration?: number;
}

export interface UpdatePasswordPolicyDto {
  minLength?: number;
  expirationDays?: number;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ==================== API ====================

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==================== SECURITY SETTINGS ====================

    getSecuritySettings: builder.query<{ settings: SecuritySettings }, void>({
      query: () => "/settings/security",
      providesTags: ["SETTINGS"],
    }),

    updateSecuritySettings: builder.mutation<
      { message: string; settings: SecuritySettings },
      UpdateSecuritySettingsDto
    >({
      query: (data) => ({
        url: "/settings/security",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["SETTINGS"],
    }),

    updatePasswordPolicy: builder.mutation<
      { message: string; policy: { minLength: number; expirationDays: number } },
      UpdatePasswordPolicyDto
    >({
      query: (data) => ({
        url: "/settings/security/password-policy",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["SETTINGS"],
    }),

    // ==================== LOGIN HISTORY ====================

    getLoginHistory: builder.query<
      { history: LoginHistoryEntry[]; total: number },
      void
    >({
      query: () => "/settings/security/login-history",
    }),

    // ==================== PASSWORD MANAGEMENT ====================

    changePassword: builder.mutation<{ message: string }, ChangePasswordDto>({
      query: (data) => ({
        url: "/settings/password/change",
        method: "POST",
        body: data,
      }),
    }),

    // ==================== SYSTEM SETTINGS ====================

    getSystemSettings: builder.query<{ settings: SystemSettings }, void>({
      query: () => "/settings/system",
      providesTags: ["SETTINGS"],
    }),

    updateSystemSettings: builder.mutation<
      { message: string; settings: SystemSettings },
      Partial<SystemSettings>
    >({
      query: (data) => ({
        url: "/settings/system",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["SETTINGS"],
    }),

    // ==================== NOTIFICATION SETTINGS ====================

    getNotificationSettings: builder.query<
      { settings: NotificationSettings },
      void
    >({
      query: () => "/settings/notifications",
      providesTags: ["SETTINGS"],
    }),

    updateNotificationSettings: builder.mutation<
      { message: string; settings: NotificationSettings },
      Partial<NotificationSettings>
    >({
      query: (data) => ({
        url: "/settings/notifications",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["SETTINGS"],
    }),
  }),
});

export const {
  // Security hooks
  useGetSecuritySettingsQuery,
  useUpdateSecuritySettingsMutation,
  useUpdatePasswordPolicyMutation,

  // Login history hooks
  useGetLoginHistoryQuery,

  // Password hooks
  useChangePasswordMutation,

  // System settings hooks
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,

  // Notification settings hooks
  useGetNotificationSettingsQuery,
  useUpdateNotificationSettingsMutation,
} = settingsApi;