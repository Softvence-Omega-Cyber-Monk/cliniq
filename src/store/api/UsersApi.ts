import baseApi from "./BaseApi/BaseApi";

// Types
export interface Clinic {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    isActive: boolean;
    subscriptionId?: string;
    createdAt: string;
    updatedAt: string;
}

export interface Therapist {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    specialization?: string;
    clinicId?: string;
    subscriptionId?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateClinicDto {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    isActive?: boolean;
}

export interface UpdateTherapistDto {
    fullName?: string;
    email?: string;
    phone?: string;
    specialization?: string;
    isActive?: boolean;
}

export interface NotificationSettings {
    emailNotifications?: boolean;
    sessionReminders?: boolean;
    crisisAlerts?: boolean;
}

export interface AssignSubscriptionDto {
    subscriptionPlanId: string;
    startDate?: string;
    endDate?: string;
}

const usersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Clinic endpoints
        getAllClinics: builder.query<Clinic[], void>({
            query: () => '/users/clinics',
            providesTags: (result) => {
                const list = Array.isArray(result) ? result : result?.data || [];

                return [
                    ...list.map(({ id } : any) => ({ type: 'CLINIC' as const, id })),
                    { type: 'CLINIC', id: 'LIST' },
                ];
            },
        }),


        getClinicById: builder.query<Clinic, string>({
            query: (id) => `/users/clinics/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'CLINIC', id }],
        }),

        getTherapistByClinic: builder.query<Therapist[], string>({
            query: (id) => `/users/clinics/${id}/therapists`,
            providesTags: (_result, _error, clinicId) => [
                { type: 'THERAPIST', id: `CLINIC_${clinicId}` },
            ],
        }),

        updateClinicProfile: builder.mutation<Clinic, { id: string; data: UpdateClinicDto }>({
            query: ({ id, data }) => ({
                url: `/users/clinics/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'CLINIC', id },
                { type: 'CLINIC', id: 'LIST' },
            ],
        }),

        deleteClinic: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/users/clinics/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: 'CLINIC', id: 'LIST' }],
        }),

        updateClinicNotification: builder.mutation<
            Clinic,
            { id: string; data: NotificationSettings }
        >({
            query: ({ id, data }) => ({
                url: `/users/clinics/${id}/notifications`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: 'CLINIC', id }],
        }),

        assignSubscriptionToClinic: builder.mutation<
            Clinic,
            { id: string; data: AssignSubscriptionDto }
        >({
            query: ({ id, data }) => ({
                url: `/users/clinics/${id}/subscriptions`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'CLINIC', id },
                { type: 'CLINIC', id: 'LIST' },
            ],
        }),

        removeSubscriptionFromClinic: builder.mutation<
            Clinic,
            { id: string; data?: any }
        >({
            query: ({ id, data }) => ({
                url: `/users/clinics/${id}/subscription`,
                method: "DELETE",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'CLINIC', id },
                { type: 'CLINIC', id: 'LIST' },
            ],
        }),

        // Therapist endpoints
        getAllTherapist: builder.query<Therapist[], void>({
            query: () => '/users/therapists',
            providesTags: (result) => {
                const list = Array.isArray(result) ? result : result?.data || [];

                return [
                    ...list.map(({ id }) => ({ type: 'THERAPIST' as const, id })),
                    { type: 'THERAPIST', id: 'LIST' },
                ];
            },
        }),


        updateTherapistProfile: builder.mutation<
            Therapist,
            { id: string; data: UpdateTherapistDto }
        >({
            query: ({ id, data }) => ({
                url: `/users/therapists/${id}`,
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'THERAPIST', id },
                { type: 'THERAPIST', id: 'LIST' },
            ],
        }),

        deleteTherapist: builder.mutation<{ message: string }, string>({
            query: (id) => ({
                url: `/users/therapists/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: [{ type: 'THERAPIST', id: 'LIST' }],
        }),

        assignSubscriptionToTherapist: builder.mutation<
            Therapist,
            { id: string; data: AssignSubscriptionDto }
        >({
            query: ({ id, data }) => ({
                url: `/users/therapists/${id}/subscription`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'THERAPIST', id },
                { type: 'THERAPIST', id: 'LIST' },
            ],
        }),

        removeTherapistFromSubscription: builder.mutation<Therapist, string>({
            query: (id) => ({
                url: `/users/therapists/${id}/subscription`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: 'THERAPIST', id },
                { type: 'THERAPIST', id: 'LIST' },
            ],
        }),
    }),
});

export const {
    useGetAllClinicsQuery,
    useGetTherapistByClinicQuery,
    useGetAllTherapistQuery,
    useGetClinicByIdQuery,
    useUpdateClinicProfileMutation,
    useDeleteClinicMutation,
    useUpdateClinicNotificationMutation,
    useAssignSubscriptionToClinicMutation,
    useRemoveSubscriptionFromClinicMutation,
    useUpdateTherapistProfileMutation,
    useDeleteTherapistMutation,
    useAssignSubscriptionToTherapistMutation,
    useRemoveTherapistFromSubscriptionMutation,
    useLazyGetAllClinicsQuery,
    useLazyGetTherapistByClinicQuery,
    useLazyGetAllTherapistQuery,
} = usersApi;

export default usersApi;