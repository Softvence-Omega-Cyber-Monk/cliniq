import React from "react";
import ClientManagementDashboard from "@/components/ClientManagement/ClientManagementDashboard";

const Clients: React.FC = () => {
  return (
    <div className=" bg-[#f3f3ec] min-h-[calc(100vh-105px)]">
      <ClientManagementDashboard />
    </div>
  );
};

export default Clients;
