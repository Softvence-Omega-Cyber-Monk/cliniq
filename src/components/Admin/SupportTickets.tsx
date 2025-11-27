"use client"

import { useState } from "react"
import { X } from "lucide-react"

interface Ticket {
  id: string
  subject: string
  user: string
  date: string
  status: "Pending" | "Resolved"
}

export default function AdminSupportTickets() {
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [replyData, setReplyData] = useState({ subject: "", message: "" })

  const tickets: Ticket[] = [
    { id: "001234", subject: "Order #123456 Issue", user: "Alex Johnson", date: "15/10/2023", status: "Pending" },
    { id: "001235", subject: "Login Problem", user: "Maria Smith", date: "16/10/2023", status: "Resolved" },
    { id: "001236", subject: "Account Verification", user: "David Brown", date: "17/10/2023", status: "Resolved" },
    { id: "001237", subject: "Order #123456 Issue", user: "Emily Davis", date: "18/10/2023", status: "Pending" },
    { id: "001238", subject: "Account Verification", user: "Michael Wilson", date: "19/10/2023", status: "Resolved" },
    { id: "001239", subject: "Login Problem", user: "Sarah Taylor", date: "20/10/2023", status: "Pending" },
  ]

  const openReplyModal = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setReplyData({ subject: "", message: "" })
    setShowReplyModal(true)
  }

  const stats = [
    { label: "Pending", value: "12", icon: "📋" },
    { label: "Completed Sessions", value: "5", icon: "📈" },
    { label: "Resolved Tickets", value: "26", icon: "👤" },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Support Tickets</h1>
        <p className="text-muted-foreground">Configure system preferences, security, and platform features</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-card p-6 bg-white border border-gray-200">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tickets Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full bg-white">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Ticket ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Subject</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">User</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-foreground">Ticket ID: {ticket.id}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{ticket.subject}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{ticket.user}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{ticket.date}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ticket.status === "Pending" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openReplyModal(ticket)}
                      className="text-teal-600 font-medium hover:text-teal-700"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Support Settings */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground">Support Settings</h2>
        <div className="rounded-lg border border-border bg-card p-6">
          <label className="block text-sm font-medium text-foreground mb-2">Auto Reply Template</label>
          <textarea
            className="w-full min-h-32 rounded-lg border border-border bg-background p-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Write your auto-reply here..."
          />
        </div>
      </div>

      {/* Reply Modal */}
      {showReplyModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">Ticket ID: {selectedTicket.id}</h2>
              <button onClick={() => setShowReplyModal(false)} className="text-muted-foreground hover:text-foreground">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">From: John Doe</p>
                <p className="text-sm text-muted-foreground">Ticket ID: {selectedTicket.id}</p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-foreground">
                  Product received damaged. Can you please help with a refund or replacement?
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-4">Reply to User</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Subject</label>
                    <input
                      type="text"
                      value={replyData.subject}
                      onChange={(e) => setReplyData({ ...replyData, subject: e.target.value })}
                      placeholder="..."
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                    <textarea
                      value={replyData.message}
                      onChange={(e) => setReplyData({ ...replyData, message: e.target.value })}
                      placeholder="Write your message here..."
                      className="w-full min-h-24 rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4">
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="px-6 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-muted"
                >
                  Cancel
                </button>
                <button className="px-6 py-2 rounded-lg bg-teal-500 text-white font-medium hover:bg-teal-600">
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
