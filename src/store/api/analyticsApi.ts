import baseApi from "./BaseApi/BaseApi";

// ==================== TYPES ====================

export interface OverviewStats {
  totalTherapists: {
    count: number;
    growth: number;
  };
  upcomingSessions: {
    count: number;
    change: number;
  };
  completedSessions: {
    count: number;
  };
}

export interface SessionCompletionData {
  data: Array<{
    week?: string;
    month?: string;
    completed: number;
    scheduled: number;
    cancelled: number;
  }>;
}

export interface TherapistActivityData {
  data: Array<{
    month: string;
    "This Week": number;
    "Last Week": number;
  }>;
}

export interface RecentSession {
  id: string;
  therapistName: string;
  therapistAvatar: string;
  action: string;
  date: Date;
  status: string;
}

export interface ReportStats {
  totalSessions: number;
  completedSessions: number;
  crisisAlerts: number;
  avgPatientProgress: string;
}

export interface SessionTrend {
  month: string;
  completed: number;
  scheduled: number;
  cancelled: number;
}

export interface TopTherapist {
  name: string;
  sessions: number;
  id: string;
}

export interface SessionTypeDistribution {
  name: string;
  value: number;
  count: number;
}

export interface TherapistPerformance {
  therapistId: string;
  therapistName: string;
  totalSessions: number;
  completedSessions: number;
  scheduledSessions: number;
  cancelledSessions: number;
  completionRate: number;
  totalClients: number;
}

export interface RevenueData {
  period: string;
  revenue: number;
  transactions: number;
}

export interface SubscriptionAnalytics {
  totalSubscriptions: number;
  activeSubscriptions: number;
  planDistribution: Array<{
    planName: string;
    activeSubscriptions: number;
    totalSubscriptions: number;
  }>;
  statusBreakdown: Record<string, number>;
}

// ==================== API ====================

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==================== OVERVIEW ENDPOINTS ====================
    
    getOverviewStats: builder.query<OverviewStats, void>({
      query: () => "/analytics/overview/stats",
    }),

    getSessionCompletion: builder.query<
      SessionCompletionData,
      { period?: "week" | "month"; range?: number }
    >({
      query: (params) => ({
        url: "/analytics/overview/session-completion",
        params,
      }),
    }),

    getTherapistActivity: builder.query<
      TherapistActivityData,
      { period?: "week" | "month" }
    >({
      query: (params) => ({
        url: "/analytics/overview/therapist-activity",
        params,
      }),
    }),

    getRecentSessions: builder.query<{ sessions: RecentSession[] }, number | void>({
      query: (limit = 5) => `/analytics/overview/recent-sessions?limit=${limit}`,
    }),

    // ==================== REPORTS ENDPOINTS ====================

    getReportStats: builder.query<ReportStats, void>({
      query: () => "/analytics/reports/stats",
    }),

    getSessionTrends: builder.query<
      { data: SessionTrend[] },
      { period?: "week" | "month" | "year"; range?: number }
    >({
      query: (params) => ({
        url: "/analytics/reports/session-trends",
        params,
      }),
    }),

    getTopTherapists: builder.query<
      { therapists: TopTherapist[] },
      { limit?: number; startDate?: string; endDate?: string }
    >({
      query: (params) => ({
        url: "/analytics/reports/top-therapists",
        params,
      }),
    }),

    getSessionTypeDistribution: builder.query<
      { distribution: SessionTypeDistribution[]; total: number },
      { startDate?: string; endDate?: string }
    >({
      query: (params) => ({
        url: "/analytics/reports/session-type-distribution",
        params,
      }),
    }),

    getTherapistPerformance: builder.query<
      { performance: TherapistPerformance[] },
      { therapistId?: string; startDate?: string; endDate?: string }
    >({
      query: (params) => ({
        url: "/analytics/reports/therapist-performance",
        params,
      }),
    }),

    getPatientProgress: builder.query<
      {
        averageProgress: number;
        totalClients: number;
        progressData: Array<{
          clientId: string;
          clientName: string;
          progress: number;
          status: string;
        }>;
      },
      { startDate?: string; endDate?: string }
    >({
      query: (params) => ({
        url: "/analytics/reports/patient-progress",
        params,
      }),
    }),

    getRevenueAnalytics: builder.query<
      {
        data: RevenueData[];
        summary: {
          totalRevenue: number;
          totalTransactions: number;
          averageTransactionValue: number;
        };
      },
      { period?: "week" | "month" | "year"; range?: number }
    >({
      query: (params) => ({
        url: "/analytics/reports/revenue",
        params,
      }),
    }),

    getSubscriptionAnalytics: builder.query<SubscriptionAnalytics, void>({
      query: () => "/analytics/reports/subscription-analytics",
    }),

    // ==================== EXPORT ====================

    exportData: builder.query<
      {
        format: string;
        data: any;
        filename: string;
      },
      {
        reportType: "sessions" | "therapists" | "revenue" | "patients";
        format?: "json" | "csv";
        startDate?: string;
        endDate?: string;
      }
    >({
      query: (params) => ({
        url: "/analytics/reports/export",
        params,
      }),
    }),
  }),
});

export const {
  // Overview hooks
  useGetOverviewStatsQuery,
  useGetSessionCompletionQuery,
  useGetTherapistActivityQuery,
  useGetRecentSessionsQuery,

  // Reports hooks
  useGetReportStatsQuery,
  useGetSessionTrendsQuery,
  useGetTopTherapistsQuery,
  useGetSessionTypeDistributionQuery,
  useGetTherapistPerformanceQuery,
  useGetPatientProgressQuery,
  useGetRevenueAnalyticsQuery,
  useGetSubscriptionAnalyticsQuery,

  // Export hook
  useExportDataQuery,
  useLazyExportDataQuery,
} = analyticsApi;