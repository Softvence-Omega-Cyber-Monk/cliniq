import baseApi from "./BaseApi/BaseApi";

const clientsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createNewClient: builder.mutation({
            query: ({ therapistId, credentials }) => ({
                url: `/therapists/${therapistId}/clients`,
                method: "POST",
                body: credentials,
            }),
        }),
        addCrisisHistory: builder.mutation({
            query: (credentials) => ({
                url: '/therapists/{therapistId}/clients/{clientId}/crisis-history',
                method: 'POST',
                body: credentials,
            }),
        }),
        updateCrisisHistory: builder.mutation({
            query: (credentials) => ({
                url: '/therapists/{therapistId}/clients/{clientId}/crisis-history',
                method: 'PUT',
                body: credentials,
            }),
        }),
        updateOverallProgress: builder.mutation({
            query: (credentials) => ({
                url: '/therapists/{therapistId}/clients/{clientId}/overall-progress',
                method: 'PUT',
                body: credentials,
            }),
        }),
        addSessionHistory: builder.mutation({
            query: (credentials) => ({
                url: '/therapists/{therapistId}/clients/{clientId}/session-history',
                method: 'POST',
                body: credentials,
            }),
        }),
        updateSessionHistory: builder.mutation({
            query: (credentials) => ({
                url: '/therapists/{therapistId}/clients/{clientId}/session-history',
                method: 'PUT',
                body: credentials,
            }),
        }),
        updateTreatmentGoals: builder.mutation({
            query: (credentials) => ({
                url: '/therapists/{therapistId}/clients/{clientId}/treatment-goals',
                method: 'PUT',
                body: credentials,
            }),
        }),
        addTreatmentProgress: builder.mutation({
            query: (credentials) => ({
                url: '/therapists/{therapistId}/clients/{clientId}/treatment-progress',
                method: 'POST',
                body: credentials,
            }),
        }),
        updateTreatmentProgress: builder.mutation({
            query: (credentials) => ({
                url: '/therapists/{therapistId}/clients/{clientId}/treatment-progress',
                method: 'PUT',
                body: credentials,
            }),
        }),
        getAllClient: builder.query({
            query: ({ therapistId, search, condition, status, page, limit }) => {
                const params = new URLSearchParams();
                if (search) params.append("search", search);
                if (condition) params.append("condition", condition);
                if (status) params.append("status", status);
                if (page) params.append("page", page.toString());
                if (limit) params.append("limit", limit.toString());

                return {
                    url: `/therapists/${therapistId}/clients?${params.toString()}`,
                    method: "GET",
                };
            },
        }),



    }),
})

export const { useCreateNewClientMutation, useAddCrisisHistoryMutation, useUpdateCrisisHistoryMutation, useUpdateOverallProgressMutation, useAddSessionHistoryMutation, useUpdateSessionHistoryMutation, useUpdateTreatmentGoalsMutation, useAddTreatmentProgressMutation, useUpdateTreatmentProgressMutation, useGetAllClientQuery } = clientsApi
export default clientsApi
