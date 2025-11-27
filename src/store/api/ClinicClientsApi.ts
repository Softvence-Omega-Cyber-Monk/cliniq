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
        })

    }),
})

export const { useAddClinicClientMutation, useGetAllClinicClientsQuery, useGetClinicClientByIdQuery } = clientsApi
export default clientsApi
