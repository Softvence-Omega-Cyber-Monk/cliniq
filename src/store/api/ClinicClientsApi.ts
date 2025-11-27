import baseApi from "./BaseApi/BaseApi";

const clientsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        addClinicClient: builder.mutation({
            query: ({ clinicId, newClient }) => ({
                url: `/clinics/${clinicId}/clients`,
                method: 'POST',
                body: newClient,
            }),
            invalidatesTags: ['ClINIC'],
        }),
        getAllClinicClients: builder.query({
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

export const { useAddClinicClientMutation, useGetAllClinicClientsQuery } = clientsApi
export default clientsApi
