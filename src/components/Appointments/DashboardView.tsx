import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Stats, Appointment } from "./types";
import StatCard from "./StatCard";
import AppointmentCard from "./AppointmentCard";
import {
  useGetAllAppointmentsQuery,
  useGetTherapistAppointmentsQuery,
} from "@/store/api/AppoinmentsApi";
import AppointmentCardSkeleton from "../Skeleton/AppointmentCardSkeleton";
import { useAppSelector } from "@/hooks/useRedux";
import { skipToken } from "@reduxjs/toolkit/query";
import { useUserId } from "@/hooks/useUserId";

interface DashboardViewProps {
  stats: Stats;
  onOpenModal: () => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  onOpenModal,
}) => {
  const userType = useAppSelector((state) => state.auth.userType);
  const userId = useUserId();
  console.log(userId);
  const [page, setPage] = useState(1);

  // Clinic Query
  const clinicAppointments = useGetAllAppointmentsQuery(
    userType === "CLINIC"
      ? {
          search: "",
          status: "scheduled",
          sessionType: "onsite",
          page,
          limit: 8,
        }
      : skipToken
  );

  // Therapist Query
  const therapistClients = useGetTherapistAppointmentsQuery(
    userType === "THERAPIST" || userType === "INDIVIDUAL_THERAPIST"
      ? {
          therapistId: userId,
          search: "",
          status: "",
          page,
          limit: 8,
        }
      : skipToken
  );

  const appointments =
    userType === "THERAPIST" || userType === "INDIVIDUAL_THERAPIST"
      ? therapistClients.data
      : clinicAppointments.data;
  console.log("app", appointments);
  const isLoading =
    userType === "THERAPIST" || userType === "INDIVIDUAL_THERAPIST"
      ? therapistClients.isLoading
      : clinicAppointments.isLoading;

  const error =
    userType === "THERAPIST" || userType === "INDIVIDUAL_THERAPIST"
      ? therapistClients.error
      : clinicAppointments.error;

  const totalPages = appointments?.meta?.totalPages || 1;
  console.log(appointments);
  return (
    <div className="min-h-screen p-4 sm:p-8">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">APPOINTMENTS</h1>
          <p className="text-[#7E8086] mb-8">
            Manage your schedule and upcoming sessions
          </p>
        </div>
        <button
          onClick={onOpenModal}
          className="flex items-center px-6 py-2.5 font-medium rounded-xl bg-[#3FDCBF] text-white hover:bg-mint-600 transition-colors  shadow-mint-500/30"
        >
          <Plus size={20} className="mr-2" /> Create New Appointment
        </button>
      </header>

      {/* Stats Cards */}
      <div className="flex flex-wrap gap-4 mb-10">
        <StatCard
          title="Total Appointments"
          value={appointments.meta?.total || 0}
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

      {/* Appointments List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading &&
          Array.from({ length: 8 }).map((_, idx) => (
            <AppointmentCardSkeleton key={idx} />
          ))}

        {!isLoading && error && (
          <div className="col-span-full flex justify-center">
            <p className="text-red-500 font-medium">
              Failed to load appointments. Please try again.
            </p>
          </div>
        )}

        {!isLoading && !error && appointments?.data?.length === 0 && (
          <div className="col-span-full flex justify-center">
            <p className="text-gray-500">No appointments found.</p>
          </div>
        )}

        {!isLoading &&
          !error &&
          appointments?.data?.map((appt: Appointment) => (
            <div key={appt.id} className="animate-fadeIn">
              <AppointmentCard appointment={appt} />
            </div>
          ))}
      </div>

      {/* Pagination */}
      {appointments?.meta?.total > 8 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 rounded bg-gray-200 disabled:opacity-40"
          >
            Previous
          </button>

          <span className="font-semibold">
            Page {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 rounded bg-gray-200 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
