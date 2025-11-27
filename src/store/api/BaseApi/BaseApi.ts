/* eslint-disable @typescript-eslint/no-explicit-any */
import { logOut, setToken } from "@/store/Slices/AuthSlice/authSlice";
import {
  BaseQueryFn,
  FetchArgs,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
  // credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  const refreshToken = (api.getState() as any).auth.refreshToken
  if (result.error && result.error.status === 401) {
    const refreshResult = await baseQuery({
      url: "/auth/refresh",
      method: "POST",
      body: { refreshToken },
    }, api, extraOptions);

    if (
      refreshResult.data &&
      typeof refreshResult.data === "object"
    ) {
      const data = refreshResult.data as RefreshResponse;

      api.dispatch(
        setToken({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        })
      );

      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut());
    }
  }

  return result;
};

const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["APPOINTMENT", "ClINIC", "RESOURCE", "SUBSCRIPTION_PLAN", "THERAPIST", "CLINIC", "SUPPORT_TICKET", "SUPPORT_MESSAGE", "ClINICClIENT"],
  endpoints: () => ({}),
});

export default baseApi;

