import baseApi from "./BaseApi/BaseApi";


const subscriptionPlansApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 01. Create Subscription Plan (POST)
    createSubscriptionPlan: builder.mutation({
      query: (data) => ({
        url: "/subscription-plans",
        method: "POST",
        body: data,
      }),
    }),

    // 02. Get All Plans (GET)
    getAllSubscriptionPlans: builder.query({
      query: () => "/subscription-plans",
    }),

    // 03. Get Plan by ID (GET)
    getSubscriptionPlanById: builder.query({
      query: (id) => `/subscription-plans/${id}`,
    }),

    // 04. Update Plan (PUT)
    updateSubscriptionPlan: builder.mutation({
      query: ({ id, data }) => ({
        url: `/subscription-plans/${id}`,
        method: "PUT",
        body: data,
      }),
    }),

    // 05. Delete Plan (DELETE)
    deleteSubscriptionPlan: builder.mutation({
      query: (id) => ({
        url: `/subscription-plans/${id}`,
        method: "DELETE",
      }),
    }),

    // 06. Restore Plan (PUT)
    restoreSubscriptionPlan: builder.mutation({
      query: (id) => ({
        url: `/subscription-plans/${id}/restore`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useCreateSubscriptionPlanMutation,
  useGetAllSubscriptionPlansQuery,
  useGetSubscriptionPlanByIdQuery,
  useUpdateSubscriptionPlanMutation,
  useDeleteSubscriptionPlanMutation,
  useRestoreSubscriptionPlanMutation,
} = subscriptionPlansApi;

export default subscriptionPlansApi;
