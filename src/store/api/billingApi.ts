import baseApi from "./BaseApi/BaseApi";

// ==================== TYPES ====================

export interface SubscriptionPlan {
  id: string;
  planName: string;
  price: number;
  duration: number;
  features: string;
  stripePriceId: string;
  createdAt: string;
  updatedAt: string;
  expiredAt: string | null;
  isPopular?: boolean;
  tagline?: string;
}

export interface Subscription {
  id: string;
  stripeSubscriptionId: string;
  subscriptionPlanId: string;
  subscriptionPlan: SubscriptionPlan;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'incomplete';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionStatus {
  hasActiveSubscription: boolean;
  hasPaymentMethod: boolean;
  hasDefaultPaymentMethod: boolean;
  paymentMethodsCount: number;
  subscription: {
    id: string;
    planId: string;
    planName: string;
    price: number;
    status: string;
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    daysUntilRenewal: number;
  } | null;
  capabilities: {
    canPurchase: boolean;
    canUpgrade: boolean;
    canDowngrade: boolean;
    canReactivate: boolean;
    canCancel: boolean;
    needsPaymentMethod: boolean;
  };
  warnings: string[];
}

export interface PaymentMethod {
  id: string;
  cardHolderName: string;
  cardLast4: string;
  cardBrand: string;
  expiryMonth: string;
  expiryYear: string;
  billingAddressLine1: string;
  billingAddressLine2?: string;
  billingCity: string;
  billingState: string;
  billingPostalCode: string;
  billingCountry: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  subscriptionId: string;
  stripeSubscriptionId: string;
  stripePaymentIntentId: string;
  stripeChargeId: string | null;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed' | 'canceled';
  description: string;
  paymentMethodLast4: string;
  paymentMethodBrand: string;
  paymentType: string;
  paidAt: string;
  createdAt: string;
  subscription?: {
    subscriptionPlan: SubscriptionPlan;
  };
}

export interface PurchaseSubscriptionDto {
  subscriptionPlanId: string;
  paymentMethodId?: string;
}

export interface UpgradeSubscriptionDto {
  newSubscriptionPlanId: string;
  prorationBehavior?: 'create_prorations' | 'none' | 'always_invoice';
  paymentMethodId?: string;
}

export interface CancelSubscriptionDto {
  cancelImmediately?: boolean;
}

export interface CreatePaymentMethodDto {
  stripePaymentMethodId: string;
  cardHolderName: string;
  cardLast4: string;
  cardBrand: string;
  expiryMonth: string;
  expiryYear: string;
  billingAddressLine1: string;
  billingAddressLine2?: string;
  billingCity: string;
  billingState: string;
  billingPostalCode: string;
  billingCountry: string;
}

export interface UpdatePaymentMethodDto {
  cardHolderName?: string;
  expiryMonth?: string;
  expiryYear?: string;
  billingAddressLine1?: string;
  billingAddressLine2?: string;
  billingCity?: string;
  billingState?: string;
  billingPostalCode?: string;
  billingCountry?: string;
}

export interface PreviewUpgradeResponse {
  chargeAmount: number;
  creditAmount: number;
  currentPlan: {
    id: string;
    planName: string;
    price: number;
  };
  newPlan: {
    id: string;
    planName: string;
    price: number;
  };
  prorationAmount: number;
  immediateCharge: number;
  nextBillingDate: string;
  currentPeriodEnd: string;
  daysRemaining: number;
  percentRemaining: number;
  currency: string;
  isUpgrade: boolean;
  isDowngrade: boolean;
  message: string;
  description?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ==================== API ENDPOINTS ====================

export const billingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ============ SUBSCRIPTION ENDPOINTS ============
    
    getCurrentSubscription: builder.query<Subscription, void>({
      query: () => '/subscriptions/current',
      providesTags: ['SUBSCRIPTION'],
    }),

    getSubscriptionStatus: builder.query<SubscriptionStatus, void>({
      query: () => '/subscriptions/status',
      providesTags: ['SUBSCRIPTION'],
    }),

    getAllSubscriptions: builder.query<PaginatedResponse<Subscription>, { page?: number; limit?: number; status?: string }>({
      query: (params) => ({
        url: '/subscriptions',
        params,
      }),
      providesTags: ['SUBSCRIPTION'],
    }),

    purchaseSubscription: builder.mutation<Subscription, PurchaseSubscriptionDto>({
      query: (data) => ({
        url: '/subscriptions/purchase',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SUBSCRIPTION', 'PAYMENT'],
    }),

    upgradeSubscription: builder.mutation<Subscription, UpgradeSubscriptionDto>({
      query: (data) => ({
        url: '/subscriptions/upgrade',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SUBSCRIPTION', 'PAYMENT'],
    }),

    previewUpgrade: builder.mutation<PreviewUpgradeResponse, { newSubscriptionPlanId: string; prorationBehavior?: string }>({
      query: (data) => ({
        url: '/subscriptions/preview-upgrade',
        method: 'POST',
        body: data,
      }),
    }),

    cancelSubscription: builder.mutation<Subscription, CancelSubscriptionDto>({
      query: (data) => ({
        url: '/subscriptions/cancel',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['SUBSCRIPTION'],
    }),

    reactivateSubscription: builder.mutation<Subscription & { message: string }, void>({
      query: () => ({
        url: '/subscriptions/reactivate',
        method: 'POST',
      }),
      invalidatesTags: ['SUBSCRIPTION'],
    }),

    // ============ SUBSCRIPTION PLANS ENDPOINTS ============

    getSubscriptionPlans: builder.query<SubscriptionPlan[], void>({
      query: () => '/subscriptions/plans',
      providesTags: ['SUBSCRIPTION_PLAN'],
    }),

    getSubscriptionPlanById: builder.query<SubscriptionPlan, string>({
      query: (id) => `/subscriptions/plans/${id}`,
      providesTags: ['SUBSCRIPTION_PLAN'],
    }),

    // ============ PAYMENT METHODS ENDPOINTS ============

    getPaymentMethods: builder.query<PaymentMethod[], void>({
      query: () => '/payment-methods',
      providesTags: ['PAYMENT_METHOD'],
    }),

    getPaymentMethodById: builder.query<PaymentMethod, string>({
      query: (id) => `/payment-methods/${id}`,
      providesTags: ['PAYMENT_METHOD'],
    }),

    getDefaultPaymentMethod: builder.query<PaymentMethod, void>({
      query: () => '/payment-methods/default',
      providesTags: ['PAYMENT_METHOD'],
    }),

    createPaymentMethod: builder.mutation<PaymentMethod, CreatePaymentMethodDto>({
      query: (data) => ({
        url: '/payment-methods',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['PAYMENT_METHOD'],
    }),

    updatePaymentMethod: builder.mutation<PaymentMethod, { id: string; data: UpdatePaymentMethodDto }>({
      query: ({ id, data }) => ({
        url: `/payment-methods/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['PAYMENT_METHOD'],
    }),

    deletePaymentMethod: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/payment-methods/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PAYMENT_METHOD'],
    }),

    setDefaultPaymentMethod: builder.mutation<PaymentMethod, string>({
      query: (id) => ({
        url: `/payment-methods/${id}/set-default`,
        method: 'POST',
      }),
      invalidatesTags: ['PAYMENT_METHOD'],
    }),

    // ============ PAYMENT HISTORY ENDPOINTS ============

    getPaymentHistory: builder.query<PaginatedResponse<Payment>, { page?: number; limit?: number }>({
      query: (params) => ({
        url: '/subscriptions/payments',
        params,
      }),
      providesTags: ['PAYMENT'],
    }),

    getPaymentById: builder.query<Payment, string>({
      query: (id) => `/subscriptions/payments/${id}`,
      providesTags: ['PAYMENT'],
    }),
  }),
});

// ==================== EXPORT HOOKS ====================

export const {
  // Subscription hooks
  useGetCurrentSubscriptionQuery,
  useGetSubscriptionStatusQuery,
  useGetAllSubscriptionsQuery,
  usePurchaseSubscriptionMutation,
  useUpgradeSubscriptionMutation,
  usePreviewUpgradeMutation,
  useCancelSubscriptionMutation,
  useReactivateSubscriptionMutation,

  // Plans hooks
  useGetSubscriptionPlansQuery,
  useGetSubscriptionPlanByIdQuery,

  // Payment methods hooks
  useGetPaymentMethodsQuery,
  useGetPaymentMethodByIdQuery,
  useGetDefaultPaymentMethodQuery,
  useCreatePaymentMethodMutation,
  useUpdatePaymentMethodMutation,
  useDeletePaymentMethodMutation,
  useSetDefaultPaymentMethodMutation,

  // Payment history hooks
  useGetPaymentHistoryQuery,
  useGetPaymentByIdQuery,
} = billingApi;