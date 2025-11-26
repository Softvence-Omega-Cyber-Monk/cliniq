import { useState, useCallback } from "react";
import { Client } from "./types";
import ClientListDashboard from "./ClientListDashboard";
import ClientDetailView from "./ClientDetailView";
import UpdateProgressModal from "./UpdateProgressModal";

const ClientManagementDashboard = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const handleSelectClient = useCallback((client: Client) => {
  //   setSelectedClient(client);
  //   window.scrollTo(0, 0);
  // }, []);

  const handleBackToList = useCallback(() => {
    setSelectedClient(null);
    window.scrollTo(0, 0);
  }, []);

  const handleUpdateProgress = (notes: string) => {
    console.log("Progress Notes Submitted:", notes);
    setIsModalOpen(false);
    alert("Progress Note saved successfully!");
  };

  return (
    <div className="">
      {selectedClient ? (
        <ClientDetailView
          client={selectedClient}
          onBack={handleBackToList}
          onOpenModal={() => setIsModalOpen(true)}
        />
      ) : (
        <ClientListDashboard />
      )}

      {/* Modal is rendered outside the main view components */}
      <UpdateProgressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleUpdateProgress}
      />
    </div>
  );
};

export default ClientManagementDashboard;
