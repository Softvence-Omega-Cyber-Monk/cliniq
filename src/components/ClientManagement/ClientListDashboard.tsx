import React, { useState, useEffect, useRef } from "react";
import { Client, Status } from "./types";
import ClientListItem from "./ClientListItem";
import { AddNewClient } from "./AddNewClient";
import ClientListItemSkeleton from "../Skeleton/ClientListItemSkeleton";
import { SearchIcon } from "lucide-react";
import { useAppSelector } from "@/hooks/useRedux";
import { useUserId } from "@/hooks/useUserId";
import { toast } from "sonner";
import { useGetAllClientQuery } from "@/store/api/ClientsApi";

import { skipToken } from "@reduxjs/toolkit/query/react";
import { useGetAllClinicClientsQuery } from "@/store/api/ClinicClientsApi";

const ClientListDashboard: React.FC = () => {
  const userType = useAppSelector((state) => state.auth.userType);
  const userId = useUserId();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<Status | "all">("all");
  const [page, setPage] = useState(1);
  const limit = 10;
  const [clients, setClients] = useState<Client[]>([]);
  const [showAddNewClientModal, setShowAddNewClientModal] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const therapistQuery = useGetAllClientQuery(
    userType === "THERAPIST"
      ? {
          therapistId: userId,
          search: searchTerm,
          status: filter === "all" ? "" : filter,
          page,
          limit,
        }
      : skipToken
  );
  const clinicQuery = useGetAllClinicClientsQuery(
    userType === "CLINIC"
      ? {
          clinicId: userId,
          search: searchTerm,
          status: filter === "all" ? "" : filter,
          page,
          limit,
        }
      : skipToken
  );

  // Select the active query
  const data =
    userType === "THERAPIST" ? therapistQuery.data : clinicQuery.data;
  console.log(data);
  const isFetching =
    userType === "THERAPIST"
      ? therapistQuery.isFetching
      : clinicQuery.isFetching;
  const isLoading =
    userType === "THERAPIST" ? therapistQuery.isLoading : clinicQuery.isLoading;
  const error =
    userType === "THERAPIST" ? therapistQuery.error : clinicQuery.error;
  const refetch =
    userType === "THERAPIST" ? therapistQuery.refetch : clinicQuery.refetch;

  // Reset page on search/filter change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, filter]);

  // Update clients when new data arrives
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

  // Error toast
  useEffect(() => {
    if (error) {
      toast.error("Failed to load clients.");
    }
  }, [error]);

  return (
    <div className="p-6 md:p-10 min-h-screen">
      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">CLIENTS</h1>
          <p className="text-gray-500 mt-1">
            Manage your client list and sessions
          </p>
        </div>
        <button
          className="mt-4 md:mt-0 px-5 py-2.5 bg-[#3FDCBF] text-white font-semibold rounded-lg hover:bg-[#46ddc1] transition shadow-md flex items-center space-x-2"
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
      <div className="flex flex-col sm:flex-row justify-between items-center py-4 px-3 rounded-[12px] bg-white space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
        <div className="relative w-full sm:w-80">
          <SearchIcon
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 rounded-lg bg-gray-100 focus:outline-none"
          />
        </div>
        <div className="flex space-x-2 p-1 rounded-lg">
          {(["all", "active", "inactive"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ease-in-out ${
                filter === f
                  ? "bg-[#298CDF] shadow text-white"
                  : "text-gray-600 border border-[#A7A9AC] bg-[#EBEBEC] hover:bg-gray-300"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Client list with infinite scroll */}
      <div
        className="space-y-4 overflow-y-auto"
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
        {/* Loading Skeletons */}
        {isLoading &&
          Array.from({ length: 8 }).map((_, index) => (
            <ClientListItemSkeleton key={index} />
          ))}

        {/* Empty State */}
        {!isLoading && clients.length === 0 && (
          <div className="text-center p-10 bg-white rounded-xl shadow-lg text-gray-500">
            No clients found matching your criteria.
          </div>
        )}

        {/* Client List */}
        {!isLoading &&
          clients.length > 0 &&
          clients.map((client) => (
            <ClientListItem
              key={client.id}
              client={client}
              onClick={() => {}}
              userType={userType}
            />
          ))}

        {/* Pagination Skeletons */}
        {!isLoading &&
          isFetching &&
          Array.from({ length: 5 }).map((_, index) => (
            <ClientListItemSkeleton key={index} />
          ))}
      </div>

      {/* Add New Client Modal */}
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
