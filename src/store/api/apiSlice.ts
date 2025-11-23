import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,

    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    // PUBLIC endpoints
    getPosts: builder.query({
      query: () => 'posts',
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
        url: '/auth/therapist/register',
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

    // PROTECTED endpoint (requires token)
    getProfile: builder.query({
      query: () => '/auth/profile',
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useRegisterClinicMutation,
  useRegisterTherapistMutation,
  useLoginMutation,
  useGetProfileQuery,
} = apiSlice;
