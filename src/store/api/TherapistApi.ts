import baseApi from "./BaseApi/BaseApi";

const therapistApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      updateTherapistAccountStatus: builder.mutation({
        query: ({ id, data }) => ({
          url: `/users/therapists/${id}`,
          method: "PUT",
          body: data,
        }),
      }),
      getTherapistClientTable: builder.query({
        query: (id) => `/therapists/${id}/clients`,
      }),
      getTherapistOverview: builder.query({
        query: (id) => `/therapists/${id}/overview`,
      }),
      getTherapistProfile: builder.query({
        query: (id) => `/therapists/${id}/profile`,
      }),
      getTherapistClientDetails: builder.query({
        query: ({therapistId,clientId}) => `/therapists/${therapistId}/clients/${clientId}`,
      }),
      getTherapistCards: builder.query({
        query: () => `/therapists/cards`,
      }),
      searchTherapist: builder.query({
        query: () => `/therapists/search`,
      }),
      getTherapistStatistics: builder.query({
        query: () => `/therapists/stats`,
      }),
      getTherapistCount: builder.query({
        query: () => `/therapists/total-count`,
      })
      
    })
});

export const { 
    useUpdateTherapistAccountStatusMutation,
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