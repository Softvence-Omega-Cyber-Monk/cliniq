import React, { useState, useEffect, useRef } from "react";
import { Client, Status } from "./types";
import ClientListItem from "./ClientListItem";
import { AddNewClient } from "./AddNewClient";
import { useGetAllClientQuery } from "@/store/api/ClientsApi";
import { toast } from "sonner";
import { useUserId } from "@/hooks/useUserId";

const ClientListDashboard: React.FC = () => {
  const userId = useUserId();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<Status | "all">("all");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [clients, setClients] = useState<Client[]>([]);
  const [showAddNewClientModal, setShowAddNewClientModal] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { data, isFetching, error, refetch } = useGetAllClientQuery({
    therapistId: userId,
    search: searchTerm,
    status: filter === "all" ? "" : filter,
    page,
    limit,
  });

  console.log(data);
  useEffect(() => {
    setPage(1);
  }, [searchTerm, filter]);

  useEffect(() => {
    if (data?.data) {
      setClients((prev) => {
        if (page === 1) {
          return data.data;
        } else {
          const newClients = data.data.filter(
            (c: (typeof data.data)[number]) => !prev.some((p) => p.id === c.id)
          );
          return [...prev, ...newClients];
        }
      });
    }
  }, [data, page]);

  // Infinite scroll handler
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    const totalPages = data?.meta?.totalPages || 1;
    if (!container || isFetching || page >= totalPages) return;

    if (
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - 10
    ) {
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (error) {
      toast.error("Failed to load clients.");
    }
  }, [error]);

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

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-emerald-500 focus:border-emerald-500 transition"
          />
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

      {/* Client list with infinite scroll */}
      <div
        className="space-y-4 h-[60vh] overflow-y-auto"
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        {clients.length > 0 ? (
          clients.map((client) => (
            <ClientListItem
              key={client.id}
              client={client}
              onClick={() => {}}
            />
          ))
        ) : (
          <div className="text-center p-10 bg-white rounded-xl shadow-lg text-gray-500">
            No clients found matching your criteria.
          </div>
        )}

        {isFetching && (
          <div className="text-center text-gray-500">Loading more...</div>
        )}
      </div>

      {showAddNewClientModal && (
        <AddNewClient
          onClientAdded={refetch}
          onClose={() => setShowAddNewClientModal(false)}
        />
      )}
    </div>
  );
};

export default ClientListDashboard;
