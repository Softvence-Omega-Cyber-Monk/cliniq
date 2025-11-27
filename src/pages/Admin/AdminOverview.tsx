import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Calendar, Users, Clock } from "lucide-react"

const sessionCompletionData = [
  { week: "Week-1", Completed: 120, Scheduled: 80, Cancelled: 40 },
  { week: "Week-2", Completed: 180, Scheduled: 120, Cancelled: 20 },
  { week: "Week-3", Completed: 160, Scheduled: 140, Cancelled: 80 },
  { week: "Week-4", Completed: 240, Scheduled: 100, Cancelled: 40 },
]

const therapistActivityData = [
  { month: "Jan", "This Week": 180, "Last Week": 140 },
  { month: "Feb", "This Week": 200, "Last Week": 160 },
  { month: "Mar", "This Week": 220, "Last Week": 180 },
  { month: "Apr", "This Week": 210, "Last Week": 190 },
  { month: "May", "This Week": 240, "Last Week": 200 },
  { month: "June", "This Week": 230, "Last Week": 210 },
]

const recentSessions = [
  { name: "Dr. Sarah Johnson", action: "Started session with Patient #1248", avatar: "SJ" },
  { name: "Arlene McCoy", action: "Started session with Patient #1248", avatar: "AM" },
  { name: "Wade Warren", action: "Started session with Patient #1248", avatar: "WW" },
  { name: "Bessie Cooper", action: "Started session with Patient #1248", avatar: "BC" },
  { name: "Kristin Watson", action: "Started session with Patient #1248", avatar: "KW" },
]

export default function AdminOverview() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-white border-gray-200 bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Therapists</p>
              <p className="text-3xl font-bold text-foreground">47</p>
            </div>
            <div className="rounded-full bg-teal-100 p-3">
              <Users className="h-6 w-6 text-teal-600" />
            </div>
          </div>
          <p className="mt-2 text-xs text-green-600">+ 12.3%</p>
        </div>

        <div className="rounded-lg bg-white border-gray-200 bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Upcoming Sessions</p>
              <p className="text-3xl font-bold text-foreground">134</p>
            </div>
            <div className="rounded-full bg-teal-100 p-3">
              <Calendar className="h-6 w-6 text-teal-600" />
            </div>
          </div>
          <p className="mt-2 text-xs text-red-600">- 12.3%</p>
        </div>
        <div className="rounded-lg bg-white border-gray-200 bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Completed Sessions</p>
              <p className="text-3xl font-bold text-foreground">892</p>
            </div>
            <div className="rounded-full bg-teal-100 p-3">
              <Clock className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Sessions Completion Chart */}
        <div className="rounded-lg bg-white border-gray-200 bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Sessions Completion</h2>
            <div className="flex gap-2">
              <button className="rounded-full bg-teal-500 px-3 py-1 text-sm font-medium text-white">Week</button>
              <button className="rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700">Month</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sessionCompletionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Completed" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="Scheduled" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="Cancelled" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Therapist Activity Chart */}
        <div className="rounded-lg bg-white border-gray-200 bg-card p-6">
          <h2 className="mb-4 text-lg font-bold text-foreground">Therapist Activity</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={therapistActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="This Week" fill="#3b82f6" />
              <Bar dataKey="Last Week" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Sessions and System Alerts */}
      <div className="grid grid-cols-1 gap-6">
        {/* Recent Sessions */}
        <div className="rounded-lg bg-white border-gray-200 bg-card p-6">
          <h2 className="mb-4 text-lg font-bold text-foreground">Recent Sessions</h2>
          <div className="space-y-4">
            {recentSessions.map((session, idx) => (
              <div key={idx} className="flex items-start gap-3 border-b border-gray-200 pb-3 last:border-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-sm font-bold text-white">
                  {session.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{session.name}</p>
                  <p className="text-sm text-muted-foreground">{session.action}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
