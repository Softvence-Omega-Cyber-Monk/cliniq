import React, { useState, useEffect, useRef } from "react";
import { Client, Status } from "./types";
import ClientListItem from "./ClientListItem";
import ClientListItemSkeleton from "../Skeleton/ClientListItemSkeleton";
import { SearchIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useAppSelector } from "@/hooks/useRedux";
import { useUserId } from "@/hooks/useUserId";
import { toast } from "sonner";
import { useGetAllClientQuery } from "@/store/api/ClientsApi";
interface Client {
  id: string;
  name: string;
  email: string;
  sessionCount: number;
  overallProgress: number | null;
  status: "active" | "inactive" | string;
}

import { skipToken } from "@reduxjs/toolkit/query/react";
import { useGetAllClinicClientsQuery } from "@/store/api/ClinicClientsApi";
import AddClientModal from "../IndividualDashboard/AddClientModal";
import AddNewClient from "./AddNewClient";

const ClientListDashboard: React.FC = () => {
  const userType = useAppSelector((state) => state.auth.userType);
  const userId = useUserId();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<Status | "all">("all");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [showAddNewClientModal, setShowAddNewClientModal] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);

  const therapistQuery = useGetAllClientQuery(
    userType === "THERAPIST" || userType === "INDIVIDUAL_THERAPIST"
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
    userType === "THERAPIST" || userType === "INDIVIDUAL_THERAPIST"
      ? therapistQuery.data
      : clinicQuery.data;

  console.log(data);
  const clients = data?.data || [];
  const meta = data?.meta;

  const isFetching =
    userType === "THERAPIST" || userType === "INDIVIDUAL_THERAPIST"
      ? therapistQuery.isFetching
      : clinicQuery.isFetching;
  const isLoading =
    userType === "THERAPIST" || userType === "INDIVIDUAL_THERAPIST"
      ? therapistQuery.isLoading
      : clinicQuery.isLoading;
  const error =
    userType === "THERAPIST" || userType === "INDIVIDUAL_THERAPIST"
      ? therapistQuery.error
      : clinicQuery.error;

  // Reset page on search/filter change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, filter]);

  // Pagination handlers
  const handleNextPage = () => {
    if (meta && page < meta.totalPages) {
      setPage(page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    if (!meta) return [];

    const totalPages = meta.totalPages;
    const currentPage = page;
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

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
        {userType === "CLINIC" ? (
          <button
            className="mt-4 md:mt-0 px-5 py-2.5 bg-[#3FDCBF] text-white font-semibold rounded-lg hover:bg-[#46ddc1] transition shadow-md flex items-center space-x-2 cursor-pointer"
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
        ) : userType === "THERAPIST" || userType === "INDIVIDUAL_THERAPIST" ? (
          <button
            onClick={() => setShowSecondModal(true)}
            className="mt-4 md:mt-0 px-5 py-2.5 bg-[#3FDCBF] text-white font-semibold rounded-lg hover:bg-[#46ddc1] transition shadow-md flex items-center space-x-2 cursor-pointer"
          >
            Add New Client
          </button>
        ) : null}
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

      {/* Client list with pagination */}
      <div className="space-y-4 overflow-y-auto mb-6">
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
          clients.map((client: Client) => (
            <ClientListItem
              key={client.id}
              client={client}
              onClick={() => {}}
              userType={userType}
            />
          ))}
      </div>

      {/* Pagination Controls */}
      {meta && meta.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 bg-white p-4 rounded-lg shadow-sm">
          {/* Page Info */}
          <div className="text-sm text-gray-600">
            Showing {(page - 1) * limit + 1} to{" "}
            {Math.min(page * limit, meta.total)} of {meta.total} clients
          </div>

          {/* Pagination Buttons */}
          <div className="flex items-center space-x-2">
            {/* Previous Button */}
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className={`p-2 rounded-lg border ${
                page === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100 cursor-pointer"
              }`}
            >
              <ChevronLeft size={16} />
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((pageNumber, index) => (
              <button
                key={index}
                onClick={() =>
                  typeof pageNumber === "number"
                    ? handlePageClick(pageNumber)
                    : null
                }
                className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg border text-sm font-medium ${
                  pageNumber === page
                    ? "bg-[#298CDF] text-white border-[#298CDF]"
                    : pageNumber === "..."
                    ? "text-gray-500 cursor-default"
                    : "text-gray-600 border-gray-300 hover:bg-gray-100 cursor-pointer"
                }`}
                disabled={pageNumber === "..."}
              >
                {pageNumber}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={handleNextPage}
              disabled={page === meta.totalPages}
              className={`p-2 rounded-lg border ${
                page === meta.totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-600 hover:bg-gray-100 cursor-pointer"
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Add New Client Modal */}
      {showAddNewClientModal && (
        <AddClientModal onClose={() => setShowAddNewClientModal(false)} />
      )}
      {showSecondModal && (
        <AddNewClient onClose={() => setShowSecondModal(false)} />
      )}
    </div>
  );
};

export default ClientListDashboard;
