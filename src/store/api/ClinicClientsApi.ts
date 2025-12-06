import baseApi from "./BaseApi/BaseApi";

const clientsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // CREATE CLIENT
        addClinicClient: builder.mutation({
            query: ({ clinicId, newClient }) => ({
                url: `/clinics/${clinicId}/clients`,
                method: "POST",
                body: newClient,
            }),
            invalidatesTags: ["ClINICClIENT"],
        }),

        // GET ALL CLIENTS
        getAllClinicClients: builder.query({
            query: ({
                clinicId,
                search = "",
                condition = "",
                status = "",
                therapistId = "",
                page = 1,
                limit = 10,
            }) => {
                const params = new URLSearchParams({
                    search,
                    condition,
                    status,
                    therapistId,
                    page: page.toString(),
                    limit: limit.toString(),
                });

                return `/clinics/${clinicId}/clients?${params.toString()}`;
            },
            providesTags: ["ClINICClIENT"],
        }),

        // GET ONE CLIENT
        getClinicClientById: builder.query({
            query: ({ clinicId, clientId }) =>
                `/clinics/${clinicId}/clients/${clientId}`,
            providesTags: ["ClINICClIENT"],
        }),

        // ADD CRISIS HISTORY
        addClinicClientCrisisHistory: builder.mutation({
            query: ({ clinicId, clientId, crisisData }) => ({
                url: `/clinics/${clinicId}/clients/${clientId}/crisis-history`,
                method: "POST",
                body: crisisData,
            }),
            invalidatesTags: ["ClINICClIENT"],
        }),

        // ADD SESSION HISTORY
        addClinicClientSessionHistory: builder.mutation({
            query: ({ clinicId, clientId, sessionData }) => ({
                url: `/clinics/${clinicId}/clients/${clientId}/session-history`,
                method: "POST",
                body: sessionData,
            }),
            invalidatesTags: ["ClINICClIENT"],
        }),

        // ADD TREATMENT PROGRESS
        addClinicClientTreatmentProgress: builder.mutation({
            query: ({ clinicId, clientId, progressData }) => ({
                url: `/clinics/${clinicId}/clients/${clientId}/treatment-progress`,
                method: "POST",
                body: progressData,
            }),
            invalidatesTags: ["ClINICClIENT"],
        }),
        assignTherapistToClient: builder.mutation({
            query: ({ clinicId, clientId, therapistId }) => ({
                url: `/clinics/${clinicId}/clients/${clientId}/assign-therapist`,
                method: "PUT",
                body: { therapistId },
                headers: {
                    "Content-Type": "application/json",
                },
            }),
        }),

    }),
});

export const {
    useAddClinicClientMutation,
    useGetAllClinicClientsQuery,
    useGetClinicClientByIdQuery,
    useAddClinicClientCrisisHistoryMutation,
    useAddClinicClientSessionHistoryMutation,
    useAddClinicClientTreatmentProgressMutation,
    useAssignTherapistToClientMutation
} = clientsApi;

export default clientsApi;
