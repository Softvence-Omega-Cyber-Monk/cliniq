import baseApi from "./BaseApi/BaseApi";

export interface SupportTicket {
  id: string;
  subject: string;
  message: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  ownerType: "CLINIC" | "THERAPIST";
  ownerId: string;
  clinicId: string | null;
  therapistId: string | null;
  adminReply: string | null;
  adminRepliedAt: Date | null;
  adminEmail: string | null;
  resolvedAt: Date | null;
  resolutionNote: string | null;
  createdAt: Date;
  updatedAt: Date;
  clinic?: {
    id: string;
    fullName: string;
    email: string;
    privatePracticeName: string;
  } | null;
  therapist?: {
    id: string;
    fullName: string;
    email: string;
  } | null;
}

export interface SupportMessage {
  id: string;
  supportId: string;
  senderType: "ADMIN" | "USER";
  senderId: string;
  senderName: string;
  senderEmail: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateTicketDto {
  subject: string;
  message: string;
}

interface UpdateTicketDto {
  subject?: string;
  message?: string;
}

interface AdminReplyDto {
  reply: string;
}

interface ResolveTicketDto {
  resolutionNote: string;
}

interface SendMessageDto {
  message: string;
}

interface TicketsResponse {
  total: number;
  tickets: SupportTicket[];
}

interface MessagesResponse {
  total: number;
  messages: SupportMessage[];
}

interface UnreadCountResponse {
  ticketId?: string;
  totalUnreadMessages?: number;
  unreadCount?: number;
}

interface TicketStatsResponse {
  total: number;
  byStatus: {
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
  };
  byUserType: {
    clinic: number;
    therapist: number;
  };
}

export const supportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ==================== USER ENDPOINTS ====================
    
    // Create a new support ticket
    createTicket: builder.mutation<{ message: string; ticket: SupportTicket }, CreateTicketDto>({
      query: (data) => ({
        url: "/support/tickets",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SUPPORT_TICKET"],
    }),

    // Get all tickets for current user
    getUserTickets: builder.query<TicketsResponse, string | void>({
      query: (status) => ({
        url: "/support/tickets",
        params: status ? { status } : undefined,
      }),
      providesTags: ["SUPPORT_TICKET"],
    }),

    // Get ticket by ID
    getTicketById: builder.query<SupportTicket, string>({
      query: (id) => `/support/tickets/${id}`,
      providesTags: (_result, _error, id) => [{ type: "SUPPORT_TICKET", id }],
    }),

    // Update a ticket
    updateTicket: builder.mutation<{ message: string; ticket: SupportTicket }, { id: string; data: UpdateTicketDto }>({
      query: ({ id, data }) => ({
        url: `/support/tickets/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "SUPPORT_TICKET", id }, "SUPPORT_TICKET"],
    }),

    // Delete a ticket
    deleteTicket: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/support/tickets/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SUPPORT_TICKET"],
    }),

    // ==================== MESSAGING ENDPOINTS ====================

    // Send a message in ticket thread
    sendMessage: builder.mutation<{ message: string; data: SupportMessage }, { ticketId: string; data: SendMessageDto }>({
      query: ({ ticketId, data }) => ({
        url: `/support/tickets/${ticketId}/messages`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { ticketId }) => [
        { type: "SUPPORT_MESSAGE", id: ticketId },
        { type: "SUPPORT_TICKET", id: ticketId },
      ],
    }),

    // Get all messages for a ticket
    getTicketMessages: builder.query<MessagesResponse, string>({
      query: (ticketId) => `/support/tickets/${ticketId}/messages`,
      providesTags: (_result, _error, ticketId) => [{ type: "SUPPORT_MESSAGE", id: ticketId }],
    }),

    // Get unread message count for ticket
    getUnreadMessageCount: builder.query<UnreadCountResponse, string>({
      query: (ticketId) => `/support/tickets/${ticketId}/unread-count`,
      providesTags: (_result, _error, ticketId) => [{ type: "SUPPORT_MESSAGE", id: ticketId }],
    }),

    // Get total unread messages
    getTotalUnreadMessages: builder.query<UnreadCountResponse, void>({
      query: () => "/support/unread-messages",
      providesTags: ["SUPPORT_MESSAGE"],
    }),

    // Delete a message
    deleteMessage: builder.mutation<{ message: string }, string>({
      query: (messageId) => ({
        url: `/support/messages/${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["SUPPORT_MESSAGE"],
    }),

    // ==================== ADMIN ENDPOINTS ====================

    // Get all tickets (Admin)
    getAllTickets: builder.query<TicketsResponse, { status?: string; ownerType?: string }>({
      query: (params) => ({
        url: "/support/admin/tickets",
        params,
      }),
      providesTags: ["SUPPORT_TICKET"],
    }),

    // Admin reply to ticket
    adminReplyToTicket: builder.mutation<{ message: string; ticket: SupportTicket }, { ticketId: string; data: AdminReplyDto }>({
      query: ({ ticketId, data }) => ({
        url: `/support/admin/tickets/${ticketId}/reply`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (_result, _error, { ticketId }) => [
        { type: "SUPPORT_TICKET", id: ticketId },
        "SUPPORT_TICKET",
        { type: "SUPPORT_MESSAGE", id: ticketId },
      ],
    }),

    // Resolve a ticket
    resolveTicket: builder.mutation<{ message: string; ticket: SupportTicket }, { ticketId: string; data: ResolveTicketDto }>({
      query: ({ ticketId, data }) => ({
        url: `/support/admin/tickets/${ticketId}/resolve`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { ticketId }) => [
        { type: "SUPPORT_TICKET", id: ticketId },
        "SUPPORT_TICKET",
      ],
    }),

    // Close a ticket
    closeTicket: builder.mutation<{ message: string; ticket: SupportTicket }, string>({
      query: (ticketId) => ({
        url: `/support/admin/tickets/${ticketId}/close`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, ticketId) => [
        { type: "SUPPORT_TICKET", id: ticketId },
        "SUPPORT_TICKET",
      ],
    }),

    // Update ticket status
    updateTicketStatus: builder.mutation<{ message: string; ticket: SupportTicket }, { ticketId: string; status: string }>({
      query: ({ ticketId, status }) => ({
        url: `/support/admin/tickets/${ticketId}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_result, _error, { ticketId }) => [
        { type: "SUPPORT_TICKET", id: ticketId },
        "SUPPORT_TICKET",
      ],
    }),

    // Get ticket statistics
    getTicketStats: builder.query<TicketStatsResponse, void>({
      query: () => "/support/admin/stats",
      providesTags: ["SUPPORT_TICKET"],
    }),
  }),
});

export const {
  // User endpoints
  useCreateTicketMutation,
  useGetUserTicketsQuery,
  useGetTicketByIdQuery,
  useUpdateTicketMutation,
  useDeleteTicketMutation,

  // Messaging endpoints
  useSendMessageMutation,
  useGetTicketMessagesQuery,
  useGetUnreadMessageCountQuery,
  useGetTotalUnreadMessagesQuery,
  useDeleteMessageMutation,

  // Admin endpoints
  useGetAllTicketsQuery,
  useAdminReplyToTicketMutation,
  useResolveTicketMutation,
  useCloseTicketMutation,
  useUpdateTicketStatusMutation,
  useGetTicketStatsQuery,
} = supportApi;