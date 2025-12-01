import SummaryCard from "@/components/Dashboard/SummaryCard";
import SessionAlert from "@/components/Dashboard/SessionAlert";
import AppointmentItem from "@/components/Dashboard/AppointmentItem";
import { useGetUpcomingAppointmentsQuery } from "@/store/api/AppoinmentsApi";
import { Appointment } from "@/components/Appointments/types";
import AppointmentItemSkeleton from "@/components/Skeleton/AppointmentItemSkeleton";
import {
  useGetCrisisAlertsQuery,
  useGetDashboardStatsQuery,
} from "@/store/api/ReportsApi";
import { AssessmentAlert } from "@/components/oldreposty/types";
import SessionAlertSkeleton from "@/components/Skeleton/SessionAlertSkeleton";
import { AlertTriangle, Calendar, ChartPie, Clock, Users } from "lucide-react";
import { useUserId } from "@/hooks/useUserId";

interface File {
  name: string;
  content: string;
  mime_type: string;
}

interface IndividualTherapistDashboardProps {
  file?: File;
}

const IndividualTherapistDashboard: React.FC<
  IndividualTherapistDashboardProps
> = () => {
  const userId = useUserId();
  const {
    data: appointments,
    isLoading,
    error,
  } = useGetUpcomingAppointmentsQuery({
    days: 7,
    limit: 5,
  });
  const { data: alerts, isLoading: loadingAlerts } = useGetCrisisAlertsQuery({
    limit: 5,
  });
  const { data: stats } = useGetDashboardStatsQuery({
    dateRange: "last_30_days",
    startDate: "",
    endDate: "",
    therapistId: userId,
    status: "",
    reportType: "performance_overview",
  });
  console.log(stats);
  const summaryCardsData = [
    {
      title: "Total Clients",
      value: stats?.totalClients,
      percent: 12.3,
      icon: Users,
      iconColor: "text-[#3FDCBF]",
      bgColor: "bg-[#F3F3EC]",
    },
    {
      title: "Upcoming Appointments",
      value: 2,
      percent: 12.3,
      icon: Calendar,
      iconColor: "text-[#3FDCBF]",
      bgColor: "bg-[#F3F3EC]",
    },
    {
      title: "Sessions Completed",
      value: 9,
      percent: 12.3,
      icon: Clock,
      iconColor: "text-[#3FDCBF]",
      bgColor: "bg-[#F3F3EC]",
    },
    {
      title: "Treatment Progress",
      value: 6,
      percent: 12.3,
      icon: ChartPie,
      iconColor: "text-[#3FDCBF]",
      bgColor: "bg-[#F3F3EC]",
    },
  ];
  return (
    <div className="flex-1 p-4 md:p-8  min-h-[calc(100vh-80px)]">
      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCardsData.map((card, index) => (
          <SummaryCard key={index} data={card} />
        ))}
      </div>

      {/* 2. Session Alerts */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Session Alerts</h2>
      <div className="space-y-4 mb-8">
        {loadingAlerts && (
          <>
            {Array.from({ length: 2 }).map((_, idx) => (
              <SessionAlertSkeleton key={idx} />
            ))}
          </>
        )}

        {!loadingAlerts && alerts?.length > 0
          ? alerts.map((alert: AssessmentAlert) => (
              <SessionAlert key={alert.id} data={alert} />
            ))
          : !loadingAlerts && (
              <div className="p-5 rounded-xl bg-[#F8F9FA] flex items-center justify-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-[#7E8086]" />
                <p className="text-sm text-[#7E8086]">No alerts at this time</p>
              </div>
            )}
      </div>

      {/* 3. Upcoming Appointments */}
      <h2 className="text-2xl font-bold text-[#32363F] mb-6">
        Upcoming Appointments
      </h2>
      <div className="space-y-3">
        {isLoading &&
          Array.from({ length: 4 }).map((_, idx) => (
            <AppointmentItemSkeleton key={idx} />
          ))}
        {error && <p className="text-red-500">Failed to load appointments.</p>}

        {!isLoading && !error && appointments?.data?.length === 0 && (
          <p>No upcoming appointments.</p>
        )}

        {!isLoading &&
          !error &&
          appointments?.data?.map((appointment: Appointment) => (
            <AppointmentItem key={appointment.id} appointment={appointment} />
          ))}
      </div>
    </div>
  );
};

export default IndividualTherapistDashboard;
