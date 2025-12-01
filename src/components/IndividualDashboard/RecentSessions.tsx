import React from "react";
import { useGetClinicRecentSessionsQuery } from "@/store/api/ReportsApi";
import type { RecentSessionType } from "../../types/dashboard";
import { useAppSelector } from "@/hooks/useRedux";

const RecentSessions: React.FC = () => {
  const userType = useAppSelector((state) => state.auth.userType);
  console.log(userType);
  const {
    data: sessions = [],
    isLoading,
    error,
  } = useGetClinicRecentSessionsQuery({ limit: 5 });
  console.log(sessions);
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Sessions</h3>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-xl">
          Failed to load sessions. Please try again.
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading ? (
        <ul className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <li
              key={i}
              className="flex items-center py-3 border-b border-gray-100 last:border-b-0"
            >
              <div className="w-10 h-10 bg-gray-300/40 rounded-full animate-pulse" />
              <div className="ml-4 flex-1 space-y-1">
                <div className="h-3 bg-gray-300/40 rounded w-2/3 animate-pulse"></div>
                <div className="h-2 bg-gray-300/40 rounded w-1/2 animate-pulse"></div>
              </div>
            </li>
          ))}
        </ul>
      ) : sessions.length === 0 ? (
        // Empty State
        <p className="text-gray-500">No recent sessions available.</p>
      ) : (
        // Render sessions
        <ul>
          {sessions.map((session: RecentSessionType) => (
            <li
              key={session.therapistId}
              className="flex items-center py-3 border-b border-gray-100 "
            >
              {/* Avatar or First Letter */}
              {session.avatarUrl ? (
                <img
                  src={session.avatarUrl}
                  alt={session.therapistName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold">
                  {session.therapistName?.[0].toUpperCase() || "?"}
                </div>
              )}

              <div className="ml-4">
                <p className="font-semibold text-gray-700">
                  {session.therapistName}
                </p>
                <p className="text-sm text-gray-500">
                  {" "}
                  Start session with Patient <span>{session.patientId}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentSessions;
