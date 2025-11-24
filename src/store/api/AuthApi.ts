import baseApi from "./BaseApi/BaseApi";

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        registration: builder.mutation({
            query: (credentials) => ({
                url: '/auth/register',
                method: 'POST',
                body: credentials,
            }),
        }),
        getProfile: builder.query({
            query: () => '/auth/profile',
        }),
        changePassword: builder.mutation({
            query: (credentials) => ({
                url: '/auth/change-password',
                method: 'POST',
                body: credentials,
            }),
        }),
        forgotPassword: builder.mutation({
            query: (credentials) => ({
                url: '/auth/forgot-password',
                method: 'POST',
                body: credentials,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
        }),
        registerClinic: builder.mutation({
            query: (data) => ({
                url: '/auth/register/clinic',
                method: 'POST',
                body: data,
            }),
        }),
        registerTherapist: builder.mutation({
            query: (data) => ({
                url: '/auth/register/therapist',
                method: 'POST',
                body: data,
            }),
        }),
        resetPassword: builder.mutation({
            query: (credentials) => ({
                url: '/auth/reset-password',
                method: 'POST',
                body: credentials,
            }),
        }),
    }),
})

export const { useLoginMutation, useRegistrationMutation, useGetProfileQuery, useChangePasswordMutation, useForgotPasswordMutation, useLogoutMutation, useRegisterClinicMutation, useRegisterTherapistMutation, useResetPasswordMutation } = authApi
export default authApi