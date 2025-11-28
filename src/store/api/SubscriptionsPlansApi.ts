import baseApi from "./BaseApi/BaseApi";

// Backend response type (what API actually returns)
interface BackendSubscriptionPlan {
  id: string;
  planName: string;
  price: number;
  duration: number; // in days
  features: string; // comma-separated string
  stripePriceId: string;
  createdAt: string;
  updatedAt: string;
  expiredAt: string | null;
  _count?: {
    clinics: number;
    therapists: number;
    subscriptions: number;
  };
}

// Frontend type (what components expect)
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  billingCycle: 'MONTHLY' | 'YEARLY';
  features: string[];
  maxClients?: number;
  maxTherapists?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// DTO for creating plans (sent to backend)
interface BackendCreateDto {
  planName: string;
  price: number;
  duration: number;
  features: string;
}

// DTO for frontend
export interface CreateSubscriptionPlanDto {
  name: string;
  price: number;
  billingCycle: 'MONTHLY' | 'YEARLY';
  features: string[];
  maxClients?: number;
  maxTherapists?: number;
  isActive?: boolean;
  role?: 'CLINIC' | 'INDIVIDUAL_THERAPIST';
}

export interface UpdateSubscriptionPlanDto {
  name?: string;
  price?: number;
  billingCycle?: 'MONTHLY' | 'YEARLY';
  features?: string[];
  maxClients?: number;
  maxTherapists?: number;
  isActive?: boolean;
}

// Transform functions
const transformBackendToFrontend = (backend: BackendSubscriptionPlan): SubscriptionPlan => {
  // Convert duration to billing cycle
  const billingCycle: 'MONTHLY' | 'YEARLY' = backend.duration === 365 ? 'YEARLY' : 'MONTHLY';
  
  // Parse features string to array
  const features = backend.features
    ? backend.features.split(',').map(f => f.trim()).filter(Boolean)
    : [];

  return {
    id: backend.id,
    name: backend.planName,
    price: backend.price,
    billingCycle,
    features,
    isActive: !backend.expiredAt, // Active if not expired
    createdAt: backend.createdAt,
    updatedAt: backend.updatedAt,
  };
};

const transformFrontendToBackend = (frontend: CreateSubscriptionPlanDto | UpdateSubscriptionPlanDto): Partial<BackendCreateDto> => {
  const transformed: any = {};
  
  if ('name' in frontend && frontend.name) {
    transformed.planName = frontend.name;
  }
  
  if ('price' in frontend && frontend.price !== undefined) {
    transformed.price = frontend.price;
  }
  
  if ('billingCycle' in frontend && frontend.billingCycle) {
    transformed.duration = frontend.billingCycle === 'YEARLY' ? 365 : 30;
  }
  
  if ('features' in frontend && frontend.features) {
    transformed.features = frontend.features.join(', ');
  }
  
  return transformed;
};

const subscriptionPlansApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 01. Create Subscription Plan (POST)
    createSubscriptionPlan: builder.mutation<SubscriptionPlan, CreateSubscriptionPlanDto>({
      query: (data) => ({
        url: "/subscription-plans",
        method: "POST",
        body: transformFrontendToBackend(data),
      }),
      transformResponse: (response: BackendSubscriptionPlan) => transformBackendToFrontend(response),
      invalidatesTags: [{ type: 'SUBSCRIPTION_PLAN', id: 'LIST' }],
    }),

    // 02. Get All Plans (GET)
    getAllSubscriptionPlans: builder.query<SubscriptionPlan[], void>({
      query: () => "/subscription-plans",
      transformResponse: (response: BackendSubscriptionPlan[]) => 
        response.map(transformBackendToFrontend),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'SUBSCRIPTION_PLAN' as const, id })),
              { type: 'SUBSCRIPTION_PLAN', id: 'LIST' },
            ]
          : [{ type: 'SUBSCRIPTION_PLAN', id: 'LIST' }],
    }),

    // 03. Get Plan by ID (GET)
    getSubscriptionPlanById: builder.query<SubscriptionPlan, string>({
      query: (id) => `/subscription-plans/${id}`,
      transformResponse: (response: BackendSubscriptionPlan) => transformBackendToFrontend(response),
      providesTags: (_result, _error, id) => [{ type: 'SUBSCRIPTION_PLAN', id }],
    }),

    // 04. Update Plan (PUT)
    updateSubscriptionPlan: builder.mutation<
      SubscriptionPlan,
      { id: string; data: UpdateSubscriptionPlanDto }
    >({
      query: ({ id, data }) => ({
        url: `/subscription-plans/${id}`,
        method: "PUT",
        body: transformFrontendToBackend(data),
      }),
      transformResponse: (response: BackendSubscriptionPlan) => transformBackendToFrontend(response),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'SUBSCRIPTION_PLAN', id },
        { type: 'SUBSCRIPTION_PLAN', id: 'LIST' },
      ],
    }),

    // 05. Delete Plan (DELETE)
    deleteSubscriptionPlan: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/subscription-plans/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: 'SUBSCRIPTION_PLAN', id: 'LIST' }],
    }),

    // 06. Restore Plan (PUT)
    restoreSubscriptionPlan: builder.mutation<SubscriptionPlan, string>({
      query: (id) => ({
        url: `/subscription-plans/${id}/restore`,
        method: "PUT",
      }),
      transformResponse: (response: BackendSubscriptionPlan) => transformBackendToFrontend(response),
      invalidatesTags: (_result, _error, id) => [
        { type: 'SUBSCRIPTION_PLAN', id },
        { type: 'SUBSCRIPTION_PLAN', id: 'LIST' },
      ],
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
  useLazyGetAllSubscriptionPlansQuery,
  useLazyGetSubscriptionPlanByIdQuery,
} = subscriptionPlansApi;

export default subscriptionPlansApi;