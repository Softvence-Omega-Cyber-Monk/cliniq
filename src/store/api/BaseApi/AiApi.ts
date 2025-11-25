import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

const aiApi = createApi({
  reducerPath: "aiApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_AI_URL,
  }),
  endpoints: (builder) => ({
    // 01. Send Session (POST)
    sendSession: builder.mutation({
      query: (data) => ({
        url: "/api/v1/insights",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useSendSessionMutation } = aiApi;
export default aiApi;
