import React from "react";
import ClientManagementDashboard from "@/components/ClientManagement/ClientManagementDashboard";

interface File {
  name: string;
  content: string;
  mime_type: string;
}

interface IndividualTherapistClientsProps {
  file?: File;
}

const IndividualTherapistClients: React.FC<
  IndividualTherapistClientsProps
> = () => {
  return (
    <div>
      <ClientManagementDashboard />
    </div>
  );
};

export default IndividualTherapistClients;
