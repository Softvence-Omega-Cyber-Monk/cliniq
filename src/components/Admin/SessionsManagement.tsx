"use client"

import { useState } from "react"
import { ChevronDown, Search, Calendar, Clock } from "lucide-react"

interface Session {
  id: string
  clientName: string
  therapistName: string
  date: string
  time: string
  therapyType: string
  status: "In Progress" | "Upcoming" | "Completed"
  statusColor: string
}

export default function SessionsManagement() {
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [timeFilter, setTimeFilter] = useState("All Time")
  const [searchQuery, setSearchQuery] = useState("")

  const sessions: Session[] = [
    {
      id: "1",
      clientName: "Emma Thompson",
      therapistName: "Dr. Sarah Mitchell",
      date: "Oct 16, 2025",
      time: "09:00 AM",
      therapyType: "Individual Therapy",
      status: "In Progress",
      statusColor: "text-teal-500",
    },
    {
      id: "2",
      clientName: "Michael Johnson",
      therapistName: "Dr. Emily Chen",
      date: "Oct 17, 2025",
      time: "10:30 AM",
      therapyType: "Group Therapy",
      status: "Upcoming",
      statusColor: "text-teal-500",
    },
    {
      id: "3",
      clientName: "Sophie Williams",
      therapistName: "Dr. John Anderson",
      date: "Oct 18, 2025",
      time: "02:00 PM",
      therapyType: "Family Therapy",
      status: "Upcoming",
      statusColor: "text-teal-500",
    },
    {
      id: "4",
      clientName: "Lucas Brown",
      therapistName: "Dr. Laura Davis",
      date: "Oct 19, 2025",
      time: "01:00 PM",
      therapyType: "Couples Therapy",
      status: "Completed",
      statusColor: "text-green-600",
    },
    {
      id: "5",
      clientName: "Olivia Martinez",
      therapistName: "Dr. James Wilson",
      date: "Oct 20, 2025",
      time: "11:00 AM",
      therapyType: "Psychological Evaluation",
      status: "In Progress",
      statusColor: "text-teal-500",
    },
    {
      id: "6",
      clientName: "Ethan Garcia",
      therapistName: "Dr. Mia Rodriguez",
      date: "Oct 21, 2025",
      time: "03:30 PM",
      therapyType: "Cognitive Behavioral Therapy",
      status: "Upcoming",
      statusColor: "text-teal-500",
    },
    {
      id: "7",
      clientName: "Ava Taylor",
      therapistName: "Dr. Robert Lee",
      date: "Oct 22, 2025",
      time: "09:30 AM",
      therapyType: "Stress Management",
      status: "Completed",
      statusColor: "text-green-600",
    },
  ]

  const stats = [
    { label: "Today's Sessions", value: "47", icon: "📋", change: "+12.3%", changeColor: "text-green-600" },
    { label: "Upcoming Sessions", value: "134", icon: "📅", change: "-12.3%", changeColor: "text-red-600" },
    { label: "Completed Sessions", value: "892", icon: "⏱️", change: "", changeColor: "" },
    { label: "Crisis Alerts", value: "3", icon: "⚠️", change: "", changeColor: "" },
  ]

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground mb-1">Sessions Management</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                {stat.change && <p className={`text-sm mt-1 ${stat.changeColor}`}>{stat.change}</p>}
              </div>
              <div className="text-2xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="mb-6 flex items-center gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500 pr-8"
            >
              <option>All Status</option>
              <option>In Progress</option>
              <option>Upcoming</option>
              <option>Completed</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="appearance-none px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500 pr-8"
            >
              <option>All Time</option>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-2">
        {sessions.map((session) => (
          <div
            key={session.id}
            className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-card/80 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-2">
                <h4 className="font-semibold text-foreground">{session.clientName}</h4>
                <p className="text-sm text-muted-foreground text-[#7E8086]">with {session.therapistName}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {session.date}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {session.time}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 ml-4">
              <p className={`text-sm font-medium ${session.statusColor}`}>{session.therapyType}</p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                  session.status === "In Progress"
                    ? "bg-teal-100 text-teal-700"
                    : session.status === "Upcoming"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                }`}
              >
                {session.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
