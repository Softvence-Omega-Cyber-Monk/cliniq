import baseApi from "./BaseApi/BaseApi";

const therapistApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateTherapistAccountStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `/therapists/${id}/account-status`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ['THERAPIST'],
    }),
    updateTherapist: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/therapists/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ['THERAPIST'],
    }),
    getTherapistClientTable: builder.query({
      query: (id) => `/therapists/${id}/clients`,
      providesTags: ['THERAPIST'],
    }),
    getTherapistOverview: builder.query({
      query: (id) => `/therapists/${id}/overview`,
      providesTags: ['THERAPIST'],
    }),
    getTherapistProfile: builder.query({
      query: (id) => `/therapists/${id}/profile`,
      providesTags: ['THERAPIST'],
    }),
    getTherapistClientDetails: builder.query({
      query: ({ therapistId, clientId }) => `/therapists/${therapistId}/clients/${clientId}`,
      providesTags: ['THERAPIST'],
    }),
    getTherapistCards: builder.query({
      query: () => `/therapists/cards`,
      providesTags: ['THERAPIST'],
    }),
    searchTherapist: builder.query({
      query: () => `/therapists/search`,
      providesTags: ['THERAPIST'],
    }),
    getTherapistStatistics: builder.query({
      query: () => `/therapists/stats`,
      providesTags: ['THERAPIST'],
    }),
    getTherapistCount: builder.query({
      query: () => `/therapists/total-count`,
      providesTags: ['THERAPIST'],
    }),


  })
});

export const {
  useUpdateTherapistAccountStatusMutation,
  useUpdateTherapistMutation,
  useGetTherapistClientTableQuery,
  useGetTherapistOverviewQuery,
  useGetTherapistProfileQuery,
  useGetTherapistClientDetailsQuery,
  useGetTherapistCardsQuery,
  useSearchTherapistQuery,
  useGetTherapistStatisticsQuery,
  useGetTherapistCountQuery
} = therapistApi;
export default therapistApi;