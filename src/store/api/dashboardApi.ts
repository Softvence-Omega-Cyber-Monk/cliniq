import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const dashboardApi = createApi({
    reducerPath: 'dashboardApi',
    baseQuery: fetchBaseQuery({
        baseUrl: import.meta.env.VITE_API_BASE_URL,

        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),

    endpoints: (builder) => ({

        getProfile: builder.query({
            query: () => '/auth/profile',
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
                }
            })
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
                }
            })
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
                }
            })
        }),
        getCrisisAlerts: builder.query({
            query: (params) => ({
                url: "/reports/crisis-alerts",
                method: "GET",
                params: {
                    limit: params.limit
                }
            })
        })
    }),
});

export const {
    useGetSessionTrendsQuery,
    useGetDashboardStatsQuery,
    useGetTherapistActivityQuery,
    useGetCrisisAlertsQuery
} = dashboardApi;
