import baseApi from "./BaseApi/BaseApi";

// Types matching backend interfaces
export interface WeeklySessionData {
  week: string;
  completed: number;
  scheduled: number;
  cancelled: number;
}

export interface MonthlySessionData {
  month: string;
  completed: number;
  scheduled: number;
  cancelled: number;
}

export interface SessionCompletionData {
  weekly: WeeklySessionData[];
  monthly: MonthlySessionData[];
}

export interface RecentSession {
  id: string;
  clientName: string;
  clientEmail: string;
  therapistName: string;
  therapistEmail: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  status: string;
  sessionType: string;
  phone: string;
  email: string;
  notes?: string;
  createdAt: string;
}

export interface SessionClient {
  id: string;
  name: string;
  email: string;
}

export interface SessionTherapist {
  id: string;
  fullName: string;
  email: string;
}

export interface Session {
  id: string;
  client: SessionClient;
  therapist: SessionTherapist;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  status: string;
  sessionType: string;
  phone: string;
  email: string;
  notes?: string;
  completionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetAllSessionsParams {
  status?: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show' | 'rescheduled';
  therapistId?: string;
  clientId?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface GetAllSessionsResponse {
  data: Session[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const adminSessionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get session completion data for graphs
    getSessionCompletionData: builder.query<SessionCompletionData, void>({
      query: () => ({
        url: '/admin/sessions/completion-data',
        method: 'GET',
      }),
      providesTags: ['APPOINTMENT'],
    }),

    // Get recent sessions
    getRecentSessions: builder.query<RecentSession[], number | void>({
      query: (limit = 20) => ({
        url: '/admin/sessions/recent',
        method: 'GET',
        params: { limit },
      }),
      providesTags: ['APPOINTMENT'],
    }),

    // Get all sessions with filters
    getAllSessions: builder.query<GetAllSessionsResponse, GetAllSessionsParams | undefined>({
      query: (params) => ({
        url: '/admin/sessions',
        method: 'GET',
        params: params || {},
      }),
      providesTags: ['APPOINTMENT'],
    }),
  }),
});

export const {
  useGetSessionCompletionDataQuery,
  useGetRecentSessionsQuery,
  useGetAllSessionsQuery,
  useLazyGetSessionCompletionDataQuery,
  useLazyGetRecentSessionsQuery,
  useLazyGetAllSessionsQuery,
} = adminSessionsApi;