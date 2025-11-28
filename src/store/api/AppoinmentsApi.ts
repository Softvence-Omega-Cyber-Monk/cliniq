import baseApi from "./BaseApi/BaseApi";

const appointmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createAppointment: builder.mutation({
      query: (credentials) => ({
        url: "/appointments",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["APPOINTMENT"],
    }),
    getAllAppointments: builder.query({
      query: ({ status, sessionType, page, limit }) => ({
        url: `/appointments`,
        method: "GET",
        params: { status, sessionType, page, limit },
      }),
      providesTags: ["APPOINTMENT"],
    }),

    getAppointmentDetails: builder.query({
      query: (id) => `/appointments/${id}`,
    }),
    updateAppointments: builder.mutation({
      query: (credentials) => ({
        url: "/appointments",
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: ["APPOINTMENT"],
    }),

    deleteAppointments: builder.mutation({
      query: (id) => ({
        url: `/appointments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["APPOINTMENT"],
    }),

    updateAppointmentsStatus: builder.mutation({
      query: (data) => ({
        url: `/appointments/${data.id}/status`,
        method: "PUT",
        body: data.data,
      }),
      invalidatesTags: ["APPOINTMENT"],
    }),

    getAppointmentsByDate: builder.query({
      query: (date) => `/appointments/by-date/${date}`,
    }),


    getClientAppointments: builder.query({
      query: (clientId) => `/appointments/client/${clientId}`,
    }),
    getAppointmentsByDateRange: builder.query({
      query: (params) => ({
        url: "/appointments/date-range",
        method: "GET",
        params: {
          startDate: params.startDate,
          endDate: params.endDate,
        },
      }),
    }),
    getTherapistAppointmentsByDate: builder.query({
      query: (params) => ({
        url: "/appointments/therapist/by-date",
        method: "GET",
        params: {
          therapistId: params.therapistId,
          date: params.date,
        },
      }),
    }),

    // THERAPIST ALL
    getTherapistAppointments: builder.query({
      query: ({ therapistId, status, sessionType, page = 1, limit = 10 }) => {
        const params = new URLSearchParams();

        if (status) params.append("status", status);
        if (sessionType) params.append("sessionType", sessionType);
        params.append("page", String(page));
        params.append("limit", String(limit));

        return `/appointments/therapist/${therapistId}?${params.toString()}`;
      },
    }),


    // TODAY
    getTodaysAppointments: builder.query({
      query: () => "/appointments/today",
    }),

    // UPCOMING
    getUpcomingAppointments: builder.query({
      query: ({ days, limit }) => ({
        url: "/appointments/upcoming",
        method: "GET",
        params: { days, limit },
      }),
      providesTags: ["APPOINTMENT"],
    }),

  }),
  overrideExisting: false,
});

export const {
  useCreateAppointmentMutation,
  useGetAllAppointmentsQuery,
  useGetAppointmentDetailsQuery,
  useUpdateAppointmentsMutation,
  useDeleteAppointmentsMutation,
  useUpdateAppointmentsStatusMutation,
  useGetAppointmentsByDateQuery,
  useGetClientAppointmentsQuery,
  useGetAppointmentsByDateRangeQuery,
  useGetTherapistAppointmentsQuery,
  useGetTodaysAppointmentsQuery,
  useGetUpcomingAppointmentsQuery
} = appointmentsApi;

export default appointmentsApi;
