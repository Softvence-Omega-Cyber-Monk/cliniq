import React from 'react';
import ClientManagementDashboard from '@/components/ClientManagement/ClientManagementDashboard';

interface File {
  name: string;
  content: string;
  mime_type: string;
}

interface IndividualTherapistClientsProps {
  file?: File;
}

const IndividualTherapistClients: React.FC<IndividualTherapistClientsProps> = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Individual Therapist Clients</h1>
      <ClientManagementDashboard />
    </div>
  );
};

export default IndividualTherapistClients;
