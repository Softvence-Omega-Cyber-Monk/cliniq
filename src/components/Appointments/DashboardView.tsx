import React from "react";
import { Plus, Grid } from "lucide-react";
import { Stats, Appointment } from "./types";
import StatCard from "./StatCard";
import AppointmentCard from "./AppointmentCard";
import { useGetUpcomingAppointmentsQuery } from "@/store/api/AppoinmentsApi";
import AppointmentCardSkeleton from "../Skeleton/AppointmentCardSkeleton";

interface DashboardViewProps {
  stats: Stats;
  onOpenModal: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  onOpenModal,
}) => {
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-gray-800">APPOINTMENTS</h1>
        <button
          onClick={onOpenModal}
          className="flex items-center px-6 py-3 font-semibold rounded-full bg-mint-500 text-white bg-[#3FDCBF] hover:bg-mint-600 transition-colors shadow-lg shadow-mint-500/30"
        >
          <Plus size={20} className="mr-2" /> Create New Appointment
        </button>
      </header>
      <p className="text-lg text-gray-600 mb-8">
        Manage your schedule and upcoming sessions
      </p>

      {/* Stats Cards */}
      <div className="flex flex-wrap gap-4 mb-10">
        <StatCard
          title="Total Appointments"
          value={stats.totalAppointments}
          delta={stats.totalAppointmentsDelta}
        />
        <StatCard
          title="Today's Sessions"
          value={stats.todaySessions}
          delta={stats.todaySessionsDelta}
        />
        <StatCard
          title="Virtual Sessions"
          value={stats.virtualSessions}
          delta={stats.virtualSessionsDelta}
        />
        <StatCard
          title="In-Person Sessions"
          value={stats.inPersonSessions}
          delta={stats.inPersonSessionsDelta}
        />
      </div>

      {/* Appointments Grid */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Grid size={24} className="mr-2 text-mint-500" /> Upcoming Sessions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* loading state */}
        {isLoading &&
          Array.from({ length: 8 }).map((_, idx) => (
            <AppointmentCardSkeleton key={idx} />
          ))}
        {/* error state */}
        {error && (
          <p className="text-red-500">
            Error fetching appointments: {error as string}
          </p>
        )}
        {/* empty state */}
        {!isLoading && !error && appointments?.data?.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No upcoming appointments.
          </p>
        )}
        {!isLoading &&
          !error &&
          appointments?.data?.map((appt: Appointment) => (
            <AppointmentCard key={appt.id} appointment={appt} />
          ))}
      </div>
    </div>
  );
};

export default DashboardView;
