import React, { useState, useMemo } from "react";
import { Client, Status } from "./types";
import ClientListItem from "./ClientListItem";
import { AddNewClient } from "./AddNewClient";

const ClientListDashboard: React.FC<{
  clients: Client[];
  onSelectClient: (client: Client) => void;
}> = ({ clients, onSelectClient }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<Status | "all">("all");
  const [showAddNewClientModal, setShowAddNewClientModal] = useState(false);

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch = client.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter = filter === "all" || client.status === filter;
      return matchesSearch && matchesFilter;
    });
  }, [clients, searchTerm, filter]);

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">CLIENTS</h1>
          <p className="text-gray-500 mt-1">
            Manage your client list and sessions
          </p>
        </div>
        <button
          className="mt-4 md:mt-0 px-5 py-2.5 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition shadow-md flex items-center space-x-2"
          onClick={() => setShowAddNewClientModal(true)}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span>Add New Client</span>
        </button>
      </header>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition"
          />
          <svg
            className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div className="flex space-x-2 bg-gray-200 p-1 rounded-lg">
          {(["all", "active", "inactive"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition ${
                filter === f
                  ? "bg-white shadow text-emerald-600"
                  : "text-gray-600 hover:bg-gray-300"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <ClientListItem
              key={client.id}
              client={client}
              onClick={onSelectClient}
            />
          ))
        ) : (
          <div className="text-center p-10 bg-white rounded-xl shadow-lg text-gray-500">
            No clients found matching your criteria.
          </div>
        )}
      </div>

      {showAddNewClientModal && (
        <AddNewClient onClose={() => setShowAddNewClientModal(false)} />
      )}
    </div>
  );
};

export default ClientListDashboard;
