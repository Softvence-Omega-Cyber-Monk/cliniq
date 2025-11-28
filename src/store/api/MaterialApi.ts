import baseApi from "./BaseApi/BaseApi";

// Enums
export enum ResourceCategory {
  WORKSHEET = 'WORKSHEET',
  PDF = 'PDF',
  VIDEO = 'VIDEO',
  DOCUMENT = 'DOCUMENT',
  GUIDE = 'GUIDE',
  EXERCISE = 'EXERCISE',
  OTHER = 'OTHER',
}

// Types
export interface Resource {
  id: string;
  title: string;
  fileUrl: string;
  filePublicId: string;
  fileType: string;
  fileSize: number;
  imageUrl?: string;
  imagePublicId?: string;
  category: ResourceCategory;
  shortDescription: string;
  longDescription?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  uploadedBy?: string;
}

export interface CreateResourceDto {
  title: string;
  category: ResourceCategory;
  shortDescription: string;
  longDescription?: string;
  isActive?: boolean;
  file: File;
  image?: File;
}

export interface UpdateResourceDto {
  title?: string;
  category?: ResourceCategory;
  shortDescription?: string;
  longDescription?: string;
  isActive?: boolean;
  file?: File;
  image?: File;
}

export interface GetResourcesParams {
  category?: ResourceCategory;
  isActive?: boolean;
}

export interface ResourceStats {
  total: number;
  active: number;
  inactive: number;
  byCategory: Array<{
    category: string;
    count: number;
  }>;
}

// Helper function to create FormData
const createResourceFormData = (
  data: CreateResourceDto | UpdateResourceDto
): FormData => {
  const formData = new FormData();

  // Add text fields
  if ('title' in data && data.title) {
    formData.append('title', data.title);
  }
  if ('category' in data && data.category) {
    formData.append('category', data.category);
  }
  if ('shortDescription' in data && data.shortDescription) {
    formData.append('shortDescription', data.shortDescription);
  }
  if ('longDescription' in data && data.longDescription !== undefined) {
    formData.append('longDescription', data.longDescription);
  }
  if ('isActive' in data && data.isActive !== undefined) {
    formData.append('isActive', String(data.isActive));
  }

  // Add files
  if ('file' in data && data.file) {
    formData.append('file', data.file);
  }
  if ('image' in data && data.image) {
    formData.append('image', data.image);
  }

  return formData;
};

export const resourcesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all resources with optional filters
    getResources: builder.query<Resource[], GetResourcesParams | undefined>({
      query: (params) => ({
        url: '/resources',
        method: 'GET',
        params: params || {},
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'RESOURCE' as const, id })),
              { type: 'RESOURCE', id: 'LIST' },
            ]
          : [{ type: 'RESOURCE', id: 'LIST' }],
    }),

    // Get resource by ID
    getResourceById: builder.query<Resource, string>({
      query: (id) => ({
        url: `/resources/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'RESOURCE', id }],
    }),

    // Get resource statistics
    getResourceStats: builder.query<ResourceStats, void>({
      query: () => ({
        url: '/resources/stats',
        method: 'GET',
      }),
      providesTags: [{ type: 'RESOURCE', id: 'STATS' }],
    }),

    // Create resource
    createResource: builder.mutation<Resource, CreateResourceDto>({
      query: (data) => {
        const formData = createResourceFormData(data);
        
        return {
          url: '/resources',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: [
        { type: 'RESOURCE', id: 'LIST' },
        { type: 'RESOURCE', id: 'STATS' },
      ],
    }),

    // Update resource
    updateResource: builder.mutation<
      Resource,
      { id: string; data: UpdateResourceDto }
    >({
      query: ({ id, data }) => {
        const formData = createResourceFormData(data);
        
        return {
          url: `/resources/${id}`,
          method: 'PATCH',
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'RESOURCE', id },
        { type: 'RESOURCE', id: 'LIST' },
        { type: 'RESOURCE', id: 'STATS' },
      ],
    }),

    // Toggle resource active status
    toggleResourceActive: builder.mutation<Resource, string>({
      query: (id) => ({
        url: `/resources/${id}/toggle-active`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'RESOURCE', id },
        { type: 'RESOURCE', id: 'LIST' },
        { type: 'RESOURCE', id: 'STATS' },
      ],
    }),

    // Delete resource
    deleteResource: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/resources/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [
        { type: 'RESOURCE', id: 'LIST' },
        { type: 'RESOURCE', id: 'STATS' },
      ],
    }),
  }),
});

export const {
  useGetResourcesQuery,
  useGetResourceByIdQuery,
  useGetResourceStatsQuery,
  useCreateResourceMutation,
  useUpdateResourceMutation,
  useToggleResourceActiveMutation,
  useDeleteResourceMutation,
  useLazyGetResourcesQuery,
  useLazyGetResourceByIdQuery,
  useLazyGetResourceStatsQuery,
} = resourcesApi;