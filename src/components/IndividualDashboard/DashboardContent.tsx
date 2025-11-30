import React, { useState } from "react";
import StatCard from "./StatCard";
import SessionsCompletionChart from "./SessionsCompletionChart";
import TherapistActivityChart from "./TherapistActivityChart";
import RecentSessions from "./RecentSessions";
// import SystemAlerts from "./SystemAlerts";
import type { StatCardType } from "../../types/dashboard";
import {
  StatUserIcon,
  StatCalendarIcon,
  // StatAlertIcon,
  StatCheckIcon,
  StatAlertIcon,
} from "../icons";
import { FaPlus } from "react-icons/fa";
import EditPersonalInfo from "./EditPersonalInfo";
import { useGetDashboardStatsQuery } from "@/store/api/ReportsApi";
import StatCardSkeleton from "@/common/StatCardSkeleton";

// import { useSelector } from "react-redux";
// import { RootState } from "@/store/store";
import AddClientModal from "./AddClientModal";
import { useUserId } from "@/hooks/useUserId";
import { ClipboardPlus, Users } from "lucide-react";

const DashboardContent: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const userId = useUserId();

  const [addClientModal, setAddClientModal] = useState(false);
  const { data: stats, isLoading } = useGetDashboardStatsQuery({
    dateRange: "last_30_days",
    startDate: "",
    endDate: "",
    therapistId: userId,
    status: "completed",
    reportType: "performance_overview",
  });

  const statCards: StatCardType[] = stats
    ? [
        {
          title: "Total Therapists",
          value: stats?.totalTherapists,
          icon: ClipboardPlus,
          percentage: stats.therapistsGrowth,
          trend: "up",
          iconBgColor: "bg-green-100 text-[#3FDCBF]",
        },
        {
          title: "Upcoming Sessions",
          value: stats?.upcomingSessions,
          icon: StatCalendarIcon,
          percentage: stats.upcomingGrowth,
          trend: "up",
          iconBgColor: "bg-[#3FDCBF1A] text-[#3FDCBF]",
        },
        {
          title: "Total Clients",
          value: stats?.totalClients,
          icon: Users,
          iconBgColor: "bg-[#3FDCBF1A] text-[#3FDCBF]",
          trend: "up",
        },
        {
          title: "Crisis Alerts",
          value: stats?.crisisAlerts,
          icon: StatAlertIcon,
          iconBgColor: "bg-red-100 text-red-600",
          trend: "up",
        },
        // {
        //   title: "Completed Sessions",
        //   value: stats?.totalSessions,
        //   icon: StatCheckIcon,
        //   iconBgColor: "bg-cyan-100 text-cyan-600",
        //   trend: "up",
        // },
      ]
    : [];

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex-1">
      <div className="pl-289">
        <div className="flex gap-[12px]">
          <button
            onClick={handleOpenModal}
            className="py-[10px] px-[11px] bg-[#32363F] text-[#fff] flex items-center gap-2 rounded-[12px] cursor-pointer"
          >
            <FaPlus /> Add New Therapist
          </button>
          <button
            onClick={() => setAddClientModal(!addClientModal)}
            className="py-[10px] px-[11px] bg-[#3FDCBF] text-[#fff] flex items-center gap-2 rounded-[12px] cursor-pointer"
          >
            <FaPlus /> Add New Client
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
        {isLoading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <StatCardSkeleton key={idx} />
            ))
          : statCards.map((card) => <StatCard key={card.title} {...card} />)}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        <SessionsCompletionChart />
        <TherapistActivityChart />
      </div>

      <div className=" mt-6">
        <RecentSessions />
        {/* <SystemAlerts /> */}
      </div>

      <EditPersonalInfo isOpen={isModalOpen} onClose={handleCloseModal} />
      {addClientModal && (
        <AddClientModal onClose={() => setAddClientModal(false)} />
      )}
    </div>
  );
};

export default DashboardContent;
