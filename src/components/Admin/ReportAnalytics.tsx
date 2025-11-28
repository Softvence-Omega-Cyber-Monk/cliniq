import { useState } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const sessionTrendData = [
  { month: "Jan", completed: 200, scheduled: 100, cancelled: 70 },
  { month: "Feb", completed: 150, scheduled: 80, cancelled: 30 },
  { month: "Mar", completed: 180, scheduled: 90, cancelled: 40 },
  { month: "Apr", completed: 160, scheduled: 60, cancelled: 25 },
  { month: "May", completed: 140, scheduled: 70, cancelled: 35 },
  { month: "Jun", completed: 120, scheduled: 80, cancelled: 15 },
  { month: "Jul", completed: 200, scheduled: 50, cancelled: 50 },
  { month: "Aug", completed: 150, scheduled: 40, cancelled: 30 },
  { month: "Sep", completed: 230, scheduled: 180, cancelled: 50 },
  { month: "Oct", completed: 210, scheduled: 100, cancelled: 45 },
  { month: "Nov", completed: 200, scheduled: 150, cancelled: 45 },
  { month: "Dec", completed: 150, scheduled: 90, cancelled: 35 },
]

const topTherapistsData = [
  { name: "Dr. Sarah Mitchell", sessions: 160 },
  { name: "Dr. James Cooper", sessions: 135 },
  { name: "Dr. Emily Rodriguez", sessions: 170 },
  { name: "Dr. Michael Chen", sessions: 130 },
]

const sessionTypeData = [
  { name: "Individual Therapy", value: 48, fill: "#86efac" },
  { name: "Group Therapy", value: 18, fill: "#3b82f6" },
  { name: "CBT", value: 22, fill: "#fbbf24" },
  { name: "DBT", value: 12, fill: "#a78bfa" },
]

export default function ReportsAnalytics() {
  const [timeRange, setTimeRange] = useState<"week" | "month">("month")

  const stats = [
    { label: "Total Sessions", value: "556", icon: "📋" },
    { label: "Completed Sessions", value: "518", icon: "📈" },
    { label: "Crisis Alerts", value: "14", icon: "⚠️" },
    { label: "Avg Patient Progress", value: "68%", icon: "👤" },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg bg-white border border-gray-200 bg-card p-6">
            <div className="text-2xl mb-2">{stat.icon}</div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Generate Reports */}
      <div className="rounded-lg border border-border bg-card p-6 bg-white border border-gray-200">
        <h2 className="text-lg font-semibold text-foreground mb-4">Generate Reports</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option>This Month</option>
            <option>Last Month</option>
            <option>This Year</option>
          </select>
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option>All Therapists</option>
            <option>Individual</option>
          </select>
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option>All Status</option>
            <option>Completed</option>
            <option>Pending</option>
          </select>
          <select className="rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-teal-500">
            <option>Therapist Performance</option>
            <option>Patient Progress</option>
          </select>
          <button className="ml-auto px-4 py-2 rounded-lg bg-teal-500 text-white font-medium hover:bg-teal-600">
            + Export Data
          </button>
        </div>
      </div>

      {/* Session Trends Chart */}
      <div className="rounded-lg bg-white border border-gray-200 bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Session Trends Over Time</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeRange("week")}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                timeRange === "week" ? "bg-teal-500 text-white" : "bg-muted text-foreground hover:bg-muted"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setTimeRange("month")}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                timeRange === "month" ? "bg-teal-500 text-white" : "bg-muted text-foreground hover:bg-muted"
              }`}
            >
              Month
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={sessionTrendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" stroke="var(--muted-foreground)" />
            <YAxis stroke="var(--muted-foreground)" />
            <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
            <Legend />
            <Line type="monotone" dataKey="completed" stroke="#86efac" strokeWidth={2} />
            <Line type="monotone" dataKey="scheduled" stroke="#fbbf24" strokeWidth={2} />
            <Line type="monotone" dataKey="cancelled" stroke="#f87171" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6 ">
        {/* Top Therapists Bar Chart */}
        <div className="rounded-lg bg-card p-6 bg-white border border-gray-200">
          <h2 className="text-lg font-semibold text-foreground mb-4">Top Therapists</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={topTherapistsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" stroke="var(--muted-foreground)" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
              <Bar dataKey="sessions" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Session Type Pie Chart */}
        <div className="rounded-lg border border-border bg-card p-6 bg-white border border-gray-200">
          <h2 className="text-lg font-semibold text-foreground mb-4">Session Type Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={sessionTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sessionTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
