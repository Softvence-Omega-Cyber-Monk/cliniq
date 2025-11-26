import React from "react";
import SummaryCard, {
  summaryCardsData,
} from "@/components/Dashboard/SummaryCard";
import SessionAlert, {
  sessionAlertsData,
} from "@/components/Dashboard/SessionAlert";
import AppointmentItem from "@/components/Dashboard/AppointmentItem";
import { useGetUpcomingAppointmentsQuery } from "@/store/api/AppoinmentsApi";
import { Appointment } from "@/components/Appointments/types";
import AppointmentItemSkeleton from "@/components/Skeleton/AppointmentItemSkeleton";

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
  const {
    data: appointments,
    isLoading,
    error,
  } = useGetUpcomingAppointmentsQuery({
    days: 7,
    limit: 10,
  });
  console.log(appointments?.data);
  return (
    <div className="flex-1 p-4 md:p-8  min-h-[calc(100vh-80px)]">
      <h1 className="text-3xl font-bold mb-4">
        Individual Therapist Dashboard
      </h1>
      {/* 1. Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCardsData.map((card, index) => (
          <SummaryCard key={index} data={card} />
        ))}
      </div>

      {/* 2. Session Alerts */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Session Alerts</h2>
      <div className="space-y-4 mb-8">
        {sessionAlertsData.map((alert, index) => (
          <SessionAlert key={index} data={alert} />
        ))}
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
