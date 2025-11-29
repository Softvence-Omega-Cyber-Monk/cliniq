import baseApi from "./BaseApi/BaseApi";

const clientsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createNewClient: builder.mutation({
      query: ({ therapistId, credentials }) => ({
        url: `/therapists/${therapistId}/clients`,
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["CLIENT"],
    }),
    addCrisisHistory: builder.mutation({
      query: ({ therapistId, clientId, crisisData }) => ({
        url: `/therapists/${therapistId}/clients/${clientId}/crisis-history`,
        method: "POST",
        body: crisisData,
      }),
    }),
    updateCrisisHistory: builder.mutation({
      query: (credentials) => ({
        url: "/therapists/{therapistId}/clients/{clientId}/crisis-history",
        method: "PUT",
        body: credentials,
      }),
    }),
    updateOverallProgress: builder.mutation({
      query: (credentials) => ({
        url: "/therapists/{therapistId}/clients/{clientId}/overall-progress",
        method: "PUT",
        body: credentials,
      }),
    }),
    addSessionHistory: builder.mutation({
      query: ({ therapistId, clientId, data }) => ({
        url: `/therapists/${therapistId}/clients/${clientId}/session-history`,
        method: "POST",
        body: data,
      }),
    }),

    updateSessionHistory: builder.mutation({
      query: ({ therapistId, clientId, data }) => ({
        url: `/therapists/${therapistId}/clients/${clientId}/session-history`,
        method: "PUT",
        body: data,
      }),
    }),

    updateTreatmentGoals: builder.mutation({
      query: (credentials) => ({
        url: "/therapists/{therapistId}/clients/{clientId}/treatment-goals",
        method: "PUT",
        body: credentials,
      }),
    }),
    addTreatmentProgress: builder.mutation({
      query: (credentials) => ({
        url: "/therapists/{therapistId}/clients/{clientId}/treatment-progress",
        method: "POST",
        body: credentials,
      }),
    }),
    updateTreatmentProgress: builder.mutation({
      query: (credentials) => ({
        url: "/therapists/{therapistId}/clients/{clientId}/treatment-progress",
        method: "PUT",
        body: credentials,
      }),
    }),
    getAllClient: builder.query({
      query: ({ therapistId, search, status, page = 1, limit = 10 }) => {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        if (status) params.append("status", status);
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        return {
          url: `/therapists/${therapistId}/clients?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["CLIENT"],
    }),
    getClientById: builder.query({
      query: ({ therapistId, clientId }) => ({
        url: `/therapists/${therapistId}/clients/${clientId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateNewClientMutation,
  useAddCrisisHistoryMutation,
  useUpdateCrisisHistoryMutation,
  useUpdateOverallProgressMutation,
  useAddSessionHistoryMutation,
  useUpdateSessionHistoryMutation,
  useUpdateTreatmentGoalsMutation,
  useAddTreatmentProgressMutation,
  useUpdateTreatmentProgressMutation,
  useGetAllClientQuery,
  useGetClientByIdQuery,
} = clientsApi;
export default clientsApi;
