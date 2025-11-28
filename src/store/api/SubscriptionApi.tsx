import baseApi from "./BaseApi/BaseApi";

const subscriptionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllSubscription: builder.query({
            query: () => `/subscriptions`,
        }),
        cancelSubscription: builder.mutation({
            query: () => ({
                url: `/subscriptions/cancel`,
                method: "POST",
                body:{"cancelImmediately": false}
            }),
        }),
        getCurrentActiveSubscription: builder.query({
            query: () => `/subscriptions/current`,
        }),
        getPaymentHistory: builder.query({
            query: () => `/subscriptions/payments`,
        }),
        getPaymentById: builder.query({
            query: (id) => `/subscriptions/payments/${id}`,
        }),
        getAvailableSubscriptionPlan: builder.query({
            query: () => `/subscriptions/plans`,
        }),
        getSubscriptionPlanById: builder.query({
            query: (id) => `/subscriptions/plans/${id}`,
        }),
        previewUpdateSubscription: builder.query({
            query: (data) => ({
                url: `/subscriptions/preview-upgrade`,
                method: "POST",
                body: data,
            }),
        }),
        purchaseSubscription: builder.mutation({
            query: (data) => ({
                url: `/subscriptions/purchase`,
                method: "POST",
                body: data,
            }),
        }),
        reactiveCancelSubscription: builder.mutation({
            query: (data) => ({
                url: `/subscriptions/reactivate`,
                method: "POST",
                body: data,
            }),
        }),
        checkStatus: builder.query({
            query: () => `/subscriptions/status`,
        }),
        updateSubscription: builder.mutation({
            query: (data) => ({
                url: `/subscriptions/upgrade`,
                method: "PUT",
                body: data,
            }),
        }),
    }),
})

export const {
    useGetAllSubscriptionQuery,
    useCancelSubscriptionMutation,
    useGetCurrentActiveSubscriptionQuery,
    useGetPaymentHistoryQuery,
    useGetPaymentByIdQuery,
    useGetAvailableSubscriptionPlanQuery,
    useGetSubscriptionPlanByIdQuery,
    usePreviewUpdateSubscriptionQuery,
    usePurchaseSubscriptionMutation,
    useReactiveCancelSubscriptionMutation,
    useCheckStatusQuery,
    useUpdateSubscriptionMutation,
} = subscriptionApi
export default subscriptionApi