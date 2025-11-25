import baseApi from "./BaseApi/BaseApi";

const clientsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createNewClient: builder.mutation({
            query: (credentials) => ({
                url: '/therapists/{therapistId}/clients',
                method: 'POST',
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

    }),
})

export const {useCreateNewClientMutation, useAddCrisisHistoryMutation, useUpdateCrisisHistoryMutation, useUpdateOverallProgressMutation, useAddSessionHistoryMutation, useUpdateSessionHistoryMutation, useUpdateTreatmentGoalsMutation, useAddTreatmentProgressMutation, useUpdateTreatmentProgressMutation } = clientsApi
export default clientsApi
