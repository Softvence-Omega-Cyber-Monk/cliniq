import React from "react";
import SummaryCard, {
  summaryCardsData,
} from "@/components/Dashboard/SummaryCard";
import SessionAlert from "@/components/Dashboard/SessionAlert";
import AppointmentItem from "@/components/Dashboard/AppointmentItem";

const Dashboard: React.FC = () => {
  return (
    <div className="flex-1 p-4 md:p-8 bg-gray-100 min-h-[calc(100vh-80px)]">
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
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Upcoming Appointments
      </h2>
      <div className="space-y-3">
        {appointmentsData.map((appointment, index) => (
          <AppointmentItem key={index} data={appointment} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
