import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL }),
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => `posts`,
    }),
    getPost: builder.query({
      query: (id) => `posts/${id}`,
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
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetPostsQuery, useGetPostQuery, useRegisterClinicMutation, useRegisterTherapistMutation, useLoginMutation } = apiSlice;
