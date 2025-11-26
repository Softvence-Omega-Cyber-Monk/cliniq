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
        addClinicClient: builder.mutation({
            query: ({ clinicId, newClient }) => ({
                url: `/clinics/${clinicId}/clients`,
                method: 'POST',
                body: newClient,
            }),
            invalidatesTags: ['ClINIC'],
        }),
        getClients: builder.query({
            query: ({
                clinicId,
                search = "",
                condition = "",
                status = "",
                therapistId,
                page = 1,
                limit = 10,
            }) =>
                `/clinics/${clinicId}/clients?search=${search}&condition=${condition}&status=${status}&therapistId=${therapistId}&page=${page}&limit=${limit}`,
            providesTags: ["ClINIC"],
        }),


    }),
})

export const { useCreateNewClientMutation, useAddCrisisHistoryMutation } = clientsApi
export default clientsApi
