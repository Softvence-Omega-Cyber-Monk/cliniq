import baseApi from "./BaseApi/BaseApi";

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => "/auth/profile",
    }),
    getDashboardStats: builder.query({
      query: (params) => ({
        url: "/reports/dashboard-stats",
        method: "GET",
        params: {
          dateRange: params.dateRange,
          startDate: params.startDate,
          endDate: params.endDate,
          therapistId: params.therapistId,
          status: params.status,
          reportType: params.reportType,
        },
      }),
    }),
    getSessionTrends: builder.query({
      query: (params) => ({
        url: "/reports/session-trends",
        method: "GET",
        params: {
          dateRange: params.dateRange,
          startDate: params.startDate,
          endDate: params.endDate,
          therapistId: params.therapistId,
          status: params.status,
          reportType: params.reportType,
        },
      }),
    }),
    getTherapistActivity: builder.query({
      query: (params) => ({
        url: "/reports/therapist-activity",
        method: "GET",
        params: {
          dateRange: params.dateRange,
          startDate: params.startDate,
          endDate: params.endDate,
          therapistId: params.therapistId,
          status: params.status,
          reportType: params.reportType,
        },
      }),
    }),
    getCrisisAlerts: builder.query({
      query: (params) => ({
        url: "/reports/session-alerts",
        method: "GET",
        params: {
          limit: params.limit,
        },
      }),
    }),
    getSessionData: builder.query({
      query: (params) => ({
        url: "/reports/session-data",
        method: "GET",
        params: {
          dateRange: params.dateRange,
          startDate: params.startDate,
          endDate: params.endDate,
          therapistId: params.therapistId,
          status: params.status,
          reportType: params.reportType,
        },
      }),
    }),
  }),
});

export const {
  useGetSessionTrendsQuery,
  useGetDashboardStatsQuery,
  useGetTherapistActivityQuery,
  useGetCrisisAlertsQuery,
  useGetSessionDataQuery,
} = reportsApi;
