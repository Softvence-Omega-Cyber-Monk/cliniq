import baseApi from "./BaseApi/BaseApi";

const usersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllClinics: builder.query({
            query: () => '/users/clinics',
        }),
        getTherapistByClinic: builder.query({
            query: (id) => `/users/therapists/${id}`,
        }),
        getClinicById: builder.query({
            query: (id) => `/users/clinics/${id}`,
        }),
        updateClinicProfile: builder.mutation({
            query: ({ id, data }) => ({
                url: `/users/clinics/${id}`,
                method: "PUT",
                body: data,
            }),
        }),
        deleteClinic: builder.mutation({
            query: (id) => ({
                url: `/users/clinics/${id}`,
                method: "DELETE",
            }),
        }),
        updateClinicNotification: builder.mutation({
            query: ({ id, data }) => ({
                url: `/users/clinics/${id}/notifications`,
                method: "PUT",
                body: data,
            }),
        }),
        assignSubscriptionToClinic: builder.mutation({
            query: ({ id, data }) => ({
                url: `/users/clinics/${id}/subscriptions`,
                method: "POST",
                body: data,
            }),
        }),
        removeSubscriptionFromClinic: builder.mutation({
            query: ({ id, data }) => ({
                url: `/users/clinics/${id}/subscription`,
                method: "DELETE",
                body: data,
            }),
        }),
        getAllTherapist: builder.query({
            query: () => '/users/therapists',
        }),
        updateTherapistProfile: builder.mutation({
            query: ({ id, data }) => ({
                url: `/users/therapists/${id}`,
                method: "PUT",
                body: data,
            }),
        }),
        deleteTherapist: builder.mutation({
            query: (id) => ({
                url: `/users/therapists/${id}`,
                method: "DELETE",
            }),
        }),
        assignSubscriptionToTherapist: builder.mutation({
            query: ({ id, data }) => ({
                url: `/users/therapists/${id}/subscription`,
                method: "POST",
                body: data,
            }),
        }),
        removeTherapistFromSubscription: builder.mutation({
            query: ( id ) => ({
                url: `/users/therapists/${id}/subscription`,
                method: "DELETE",
               
            }),
        })

    }),
})

export const { useGetAllClinicsQuery, useGetTherapistByClinicQuery, useGetAllTherapistQuery, useGetClinicByIdQuery, 
    useUpdateClinicProfileMutation, useDeleteClinicMutation, useUpdateClinicNotificationMutation, useAssignSubscriptionToClinicMutation, 
    useRemoveSubscriptionFromClinicMutation, useUpdateTherapistProfileMutation, useDeleteTherapistMutation, useAssignSubscriptionToTherapistMutation,
    useRemoveTherapistFromSubscriptionMutation
 } = usersApi
export default usersApi