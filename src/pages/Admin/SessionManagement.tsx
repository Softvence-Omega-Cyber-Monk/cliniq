import { useState, useMemo } from "react"
import { ChevronDown, Search, Calendar, Clock, Loader2, AlertCircle } from "lucide-react"
import { useGetAllSessionsQuery, useGetSessionCompletionDataQuery } from "@/store/api/AdminSession"
export default function SessionsManagement() {
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [limit] = useState(10)

  // Fetch sessions data
  const { 
    data: sessionsData, 
    isLoading: sessionsLoading, 
    error: sessionsError 
  } = useGetAllSessionsQuery({
    page,
    limit,
  })

  // Fetch stats data
  const { 
    data: _statsData, 
    isLoading: statsLoading 
  } = useGetSessionCompletionDataQuery()

  // Calculate stats from the data
  const stats = useMemo(() => {
    const today = new Date().toDateString()
    const sessions = sessionsData?.data || []
    
    const todaySessions = sessions.filter(
      s => new Date(s.scheduledDate).toDateString() === today
    ).length

    const upcomingSessions = sessions.filter(
      s => s.status === 'scheduled' || s.status === 'confirmed'
    ).length

    const completedSessions = sessions.filter(
      s => s.status === 'completed'
    ).length

    const crisisAlerts = sessions.filter(
      s => s.notes?.toLowerCase().includes('crisis') || 
           s.notes?.toLowerCase().includes('urgent')
    ).length

    return [
      { 
        label: "Today's Sessions", 
        value: todaySessions.toString(), 
        icon: "📋", 
        change: "", 
        changeColor: "" 
      },
      { 
        label: "Upcoming Sessions", 
        value: upcomingSessions.toString(), 
        icon: "📅", 
        change: "", 
        changeColor: ""   
      },
      { 
        label: "Completed Sessions", 
        value: completedSessions.toString(), 
        icon: "⏱️", 
        change: "", 
        changeColor: "" 
      },
      { 
        label: "Crisis Alerts", 
        value: crisisAlerts.toString(), 
        icon: "⚠️", 
        change: "", 
        changeColor: "" 
      },
    ]
  }, [sessionsData])

  // Filter sessions by search query
  const filteredSessions = useMemo(() => {
    if (!sessionsData?.data) return []
    
    return sessionsData.data.filter(session => {
      const searchLower = searchQuery.toLowerCase()
      return (
        session.client.name.toLowerCase().includes(searchLower) ||
        session.therapist.fullName.toLowerCase().includes(searchLower) ||
        session.sessionType.toLowerCase().includes(searchLower)
      )
    })
  }, [sessionsData, searchQuery])

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  // Get status color and badge style
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return {
          badge: 'bg-green-100 text-green-700',
          text: 'Completed'
        }
      case 'scheduled':
      case 'confirmed':
        return {
          badge: 'bg-blue-100 text-blue-700',
          text: 'Upcoming'
        }
      case 'cancelled':
        return {
          badge: 'bg-red-100 text-red-700',
          text: 'Cancelled'
        }
      case 'no-show':
        return {
          badge: 'bg-gray-100 text-gray-700',
          text: 'No Show'
        }
      default:
        return {
          badge: 'bg-teal-100 text-teal-700',
          text: 'In Progress'
        }
    }
  }

  if (sessionsError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg font-semibold text-gray-900">Error loading sessions</p>
          <p className="text-sm text-gray-600 mt-2">Please try again later</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Sessions Management</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsLoading ? (
          <div className="col-span-4 flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          </div>
        ) : (
          stats.map((stat, idx) => (
            <div key={idx} className="rounded-lg bg-white p-4 border border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  {stat.change && <p className={`text-sm mt-1 ${stat.changeColor}`}>{stat.change}</p>}
                </div>
                <div className="text-2xl">{stat.icon}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="flex-1 relative bg-white">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by client, therapist, or session type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none px-4 py-2 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 pr-8 border border-gray-200"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Sessions List */}
      {sessionsLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No sessions found</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {filteredSessions.map((session) => {
              const statusStyle = getStatusStyle(session.status)
              
              return (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-white border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h4 className="font-semibold text-gray-900">{session.client.name}</h4>
                      <p className="text-sm text-gray-500">with {session.therapist.fullName}</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(session.scheduledDate)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {session.scheduledTime}
                      </div>
                      <div className="text-gray-600">
                        {session.duration} min
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 ml-4">
                    <p className="text-sm font-medium text-teal-600 hidden sm:block">
                      {session.sessionType}
                    </p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${statusStyle.badge}`}>
                      {statusStyle.text}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {sessionsData && sessionsData.meta.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, sessionsData.meta.total)} of {sessionsData.meta.total} sessions
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(sessionsData.meta.totalPages, p + 1))}
                  disabled={page === sessionsData.meta.totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}