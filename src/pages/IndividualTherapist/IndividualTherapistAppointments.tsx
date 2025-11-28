import React, { useState, useCallback } from "react";
import { MOCK_STATS } from "@/components/Appointments/mockData";
import { Client } from "@/components/Appointments/types";
import DashboardView from "@/components/Appointments/DashboardView";
import SessionView from "@/components/Appointments/SessionView";
import ScheduleModal from "@/components/Appointments/ScheduleModal";

interface File {
  name: string;
  content: string;
  mime_type: string;
}

interface IndividualTherapistAppointmentsProps {
  file?: File;
}

const IndividualTherapistAppointments: React.FC<
  IndividualTherapistAppointmentsProps
> = () => {
  const [view, setView] = useState<"dashboard" | "session">("dashboard");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeClient, setActiveClient] = useState<Client | null>(null);

  // const handleStartSession = useCallback((client: Client) => {
  //   setActiveClient(client);
  //   setView("session");
  // }, []);

  const handleEndSession = useCallback(() => {
    setActiveClient(null);
    setView("dashboard");
  }, []);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <div className=" min-h-screen">
      {view === "dashboard" && (
        <DashboardView stats={MOCK_STATS} onOpenModal={handleOpenModal} />
      )}

      {view === "session" && activeClient && (
        <SessionView client={activeClient} onEndSession={handleEndSession} />
      )}

      {isModalOpen && <ScheduleModal onClose={handleCloseModal} />}
    </div>
  );
};

export default IndividualTherapistAppointments;
