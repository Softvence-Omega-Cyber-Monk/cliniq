import baseApi from "./BaseApi/BaseApi";

const clientsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        addClinicClient: builder.mutation({
            query: ({ clinicId, newClient }) => ({
                url: `/clinics/${clinicId}/clients`,
                method: 'POST',
                body: newClient,
            }),
            invalidatesTags: ['ClINICClIENT'],
        }),
        getAllClinicClients: builder.query({
            query: ({
                clinicId,
                search = "",
                condition = "",
                status = "",
                therapistId = "",
                page = 1,
                limit = 10,
            }) =>
                `/clinics/${clinicId}/clients?search=${search}&condition=${condition}&status=${status}&therapistId=${therapistId}&page=${page}&limit=${limit}`,
            providesTags: ["ClINICClIENT"],
        }),
        getClinicClientById: builder.query({
            query: ({ clinicId, clientId }) =>
                `/clinics/${clinicId}/clients/${clientId}`,
        }),
        addClinicClientCrisisHistory: builder.mutation({
            query: ({ clinicId, clientId, crisisData }) => ({
                url: `/clinics/${clinicId}/clients/${clientId}/crisis-history`,
                method: 'POST',
                body: crisisData,
            }),
        }),
        addClinicClientSessionHistory: builder.mutation({
            query: ({ clinicId, clientId, sessionData }) => ({
                url: `/clinics/${clinicId}/clients/${clientId}/session-history`,
                method: 'POST',
                body: sessionData,
            }),
        }),


    }),
})

export const { useAddClinicClientMutation, useGetAllClinicClientsQuery, useGetClinicClientByIdQuery, useAddClinicClientCrisisHistoryMutation, useAddClinicClientSessionHistoryMutation, } = clientsApi
export default clientsApi
