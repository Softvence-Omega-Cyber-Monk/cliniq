/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import {
  useGetAllTicketsQuery,
  useGetTicketStatsQuery,
  useSendMessageMutation,
  useGetTicketMessagesQuery,
  useUpdateTicketStatusMutation,
  SupportTicket,
} from "@/store/api/supportApi";
import { toast } from "sonner";

export default function AdminSupportTickets() {
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null
  );
  const [replyMessage, setReplyMessage] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");

  // RTK Query hooks
  const { data: ticketsData, isLoading: ticketsLoading } =
    useGetAllTicketsQuery({
      status: statusFilter || undefined,
    });
  const { data: statsData } = useGetTicketStatsQuery();
  const { data: messagesData, isLoading: messagesLoading } =
    useGetTicketMessagesQuery(selectedTicket?.id || "", {
      skip: !selectedTicket,
    });
  const [sendMessage, { isLoading: sendingMessage }] = useSendMessageMutation();
  const [updateStatus] = useUpdateTicketStatusMutation();

  const openReplyModal = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setReplyMessage("");
    setShowReplyModal(true);
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    try {
      await sendMessage({
        ticketId: selectedTicket.id,
        data: { message: replyMessage },
      }).unwrap();

      toast.success("Reply sent successfully");
      setReplyMessage("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send reply");
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      await updateStatus({
        ticketId,
        status: newStatus,
      }).unwrap();

      toast.success("Status updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const stats = [
    {
      label: "Pending",
      value: statsData?.byStatus.open?.toString() || "0",
      icon: "📋",
    },
    {
      label: "In Progress",
      value: statsData?.byStatus.inProgress?.toString() || "0",
      icon: "📈",
    },
    {
      label: "Resolved Tickets",
      value: statsData?.byStatus.resolved?.toString() || "0",
      icon: "👤",
    },
  ];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-700";
      case "in-progress":
        return "bg-amber-100 text-amber-700";
      case "resolved":
        return "bg-green-100 text-green-700";
      case "closed":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Support Tickets</h1>
        <p className="text-muted-foreground">
          Manage and respond to user support requests
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border-border bg-card p-6 bg-white border border-gray-200"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-4 items-center">
        <label className="text-sm font-medium">Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="">All</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Tickets Table */}
      <div className="rounded-lg border border-gray-200 bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full bg-white">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Ticket ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  User
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ticketsLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <Loader2 className="animate-spin mx-auto" size={32} />
                  </td>
                </tr>
              ) : ticketsData?.tickets.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    No tickets found
                  </td>
                </tr>
              ) : (
                ticketsData?.tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    className="hover:bg-muted/30 transition-colors border-b border-gray-200"
                  >
                    <td className="px-6 py-4 text-sm text-foreground border-t border-gray-200">
                      {ticket.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground border-t border-gray-200">
                      {ticket.subject}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground border-t border-gray-200">
                      {ticket.clinic?.fullName ||
                        ticket.therapist?.fullName ||
                        "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground border-t border-gray-200">
                      <span className="px-2 py-1 rounded text-xs bg-gray-100">
                        {ticket.ownerType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground border-t border-gray-200">
                      {formatDate(ticket.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-sm border-t border-gray-200">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                          ticket.status
                        )}`}
                      >
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-t border-gray-200">
                      <button
                        onClick={() => openReplyModal(ticket)}
                        className="text-teal-600 font-medium hover:text-teal-700 cursor-pointer"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-300 sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Ticket ID: {selectedTicket.id.slice(0, 8)}...
                </h2>
                <p className="text-sm text-muted-foreground">
                  {selectedTicket.subject}
                </p>
              </div>
              <button
                onClick={() => setShowReplyModal(false)}
                className="text-muted-foreground cursor-pointer hover:text-foreground"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Ticket Info */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-sm">
                  <span className="font-semibold">From:</span>{" "}
                  {selectedTicket.clinic?.fullName ||
                    selectedTicket.therapist?.fullName}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Email:</span>{" "}
                  {selectedTicket.clinic?.email ||
                    selectedTicket.therapist?.email}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Type:</span>{" "}
                  {selectedTicket.ownerType}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">Created:</span>{" "}
                  {formatDate(selectedTicket.createdAt)}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">Status:</span>
                  <select
                    value={selectedTicket.status}
                    onChange={(e) =>
                      handleStatusChange(selectedTicket.id, e.target.value)
                    }
                    className="text-sm rounded border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="open">Open</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Initial Message */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm font-semibold mb-2">Initial Message:</p>
                <p className="text-sm text-foreground">
                  {selectedTicket.message}
                </p>
              </div>

              {/* Conversation Thread */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  Conversation
                </h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {messagesLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="animate-spin" size={24} />
                    </div>
                  ) : messagesData?.messages.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No messages yet
                    </p>
                  ) : (
                    messagesData?.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`p-3 rounded-lg ${
                          msg.senderType === "ADMIN"
                            ? "bg-teal-50 ml-8"
                            : "bg-gray-50 mr-8"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-semibold">
                            {msg.senderName} ({msg.senderType})
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDate(msg.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Reply Form */}
              <div>
                <h3 className="font-semibold text-foreground mb-3">
                  Send Reply
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Message
                    </label>
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your reply here..."
                      className="w-full min-h-32 rounded-lg border border-gray-300 bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500"
                      disabled={selectedTicket.status === "closed"}
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end pt-4 border-t">
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="cursor-pointer px-6 py-2 rounded-lg border border-gray-300 text-foreground font-medium hover:bg-muted"
                >
                  Close
                </button>
                <button
                  onClick={handleSendReply}
                  disabled={
                    sendingMessage ||
                    !replyMessage.trim() ||
                    selectedTicket.status === "closed"
                  }
                  className="cursor-pointer px-6 py-2 rounded-lg bg-teal-500 text-white font-medium hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {sendingMessage && (
                    <Loader2 className="animate-spin" size={16} />
                  )}
                  Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
