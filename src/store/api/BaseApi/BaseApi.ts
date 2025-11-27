// import { logout, setToken } from "@/store/Slices/AuthSlice/authSlice";
import {
  // BaseQueryFn,
  // FetchArgs,
  fetchBaseQuery,
  // FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";

// interface RefreshResponse {
//   accessToken: string;
//   refreshToken: string;
// }

// const baseQuery = fetchBaseQuery({
//   baseUrl: import.meta.env.VITE_API_BASE_URL,
//   prepareHeaders: (headers) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       headers.set("Authorization", `Bearer ${token}`);
//     }
//     return headers;
//   },
// });

// const baseQueryWithReauth: BaseQueryFn<
//   string | FetchArgs,
//   unknown,
//   FetchBaseQueryError
// > = async (args, api, extraOptions) => {
//   let result = await baseQuery(args, api, extraOptions);

//   if (result.error && result.error.status === 401) {
//     const refreshResult = await baseQuery("/auth/refresh", api, extraOptions);

//     if (
//       refreshResult.data &&
//       typeof refreshResult.data === "object"
//     ) {
//       const data = refreshResult.data as RefreshResponse;

//       api.dispatch(
//         setToken({
//           accessToken: data.accessToken,
//           refreshToken: data.refreshToken,
//         })
//       );

//       result = await baseQuery(args, api, extraOptions);
//     } else {
//       api.dispatch(logout());
//     }
//   }

//   return result;
// };

const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    }
  }),
  tagTypes: ["APPOINTMENT", "ClINIC", "RESOURCE", "SUBSCRIPTION_PLAN", "THERAPIST", "CLINIC", "SUPPORT_TICKET", "SUPPORT_MESSAGE"],

  endpoints: () => ({}),
});

export default baseApi;
