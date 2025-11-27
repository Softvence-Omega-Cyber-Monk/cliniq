/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useMemo, useEffect } from "react";
import { Search, ChevronDown, Plus } from "lucide-react";
import AddTherapistModal from "./AddTherapistModal";
import { useGetTherapistByClinicQuery } from "@/store/api/UsersApi";
import { useUserId } from "@/hooks/useUserId";
import { Therapist } from "./TherapistType";
import { MOCK_PATIENTS } from "./MockTherapist";
import TherapistCard from "./TherapistCard";
import PatientDetail from "./PatientDetail";
import TherapistDetail from "./TherapistDetail";

// --- Main Component ---

const App: React.FC = () => {
  const userId = useUserId();
  const { data, isLoading } = useGetTherapistByClinicQuery(userId);
  const therapistData = data?.data || [];
  const [therapists, setTherapist] = useState<Therapist[]>(therapistData);
  useEffect(() => {
    if (data?.data) {
      setTherapist(data.data);
    }
  }, [data]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Active" | "Inactive"
  >("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTherapistId, setSelectedTherapistId] = useState<string | null>(
    null
  );
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null
  );

  const filteredTherapists = useMemo(() => {
    return therapists.filter((therapist) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        therapist.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        therapist.specialty.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        filterStatus === "All" || therapist.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, filterStatus, therapists]);

  if (isLoading) return <div>Loading...</div>;

  const openAddModal = () => {
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = () => {
    setIsEditMode(true);
    setIsModalOpen(true);
  };



  const handleViewPatientDetails = (patientId: number) => {
    setSelectedPatientId(patientId);
  };

  const handleBackToTherapist = () => {
    setSelectedPatientId(null);
  };

  const handleBackToList = () => {
    setSelectedTherapistId(null);
    setSelectedPatientId(null);
  };

  const totalTherapists = filteredTherapists.length;
  const selectedTherapist = therapists.find(
    (t) => t.id === selectedTherapistId
  );
  const selectedPatient = MOCK_PATIENTS.find((p) => p.id === selectedPatientId);
  const isListView = selectedTherapistId === null || !selectedTherapist;
  const isTherapistDetailView = !isListView && selectedPatientId === null;
  const isPatientDetailView =
    selectedPatientId !== null && selectedPatient && selectedTherapist;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 ">
      {/* List Header and Controls - Show only in list view */}
      {isListView && (
        <>
          <header className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                THERAPISTS
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage therapists in your practice.
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:bg-gray-700 transition"
            >
              <Plus size={16} className="mr-2" />
              Add New Therapist
            </button>
          </header>
          {/* Controls: Search, Filter, Count */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8 items-stretch">
            <div className="relative flex-grow lg:w-1/3">
              <Search
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-10 pr-4 border border-gray-200 rounded-xl focus:ring-teal-500 focus:border-teal-500 transition shadow-sm"
              />
            </div>

            <div className="relative w-full sm:w-1/3 lg:w-1/6">
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(
                    e.target.value as "All" | "Active" | "Inactive"
                  )
                }
                className="appearance-none w-full py-3 pl-4 pr-10 border border-gray-200 rounded-xl bg-white focus:ring-teal-500 focus:border-teal-500 transition shadow-sm cursor-pointer"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
              />
            </div>

            <div className="bg-green-50 p-3 rounded-xl flex items-center justify-between shadow-sm lg:w-1/6 min-w-[150px]">
              <span className="text-gray-700 font-medium">Total Therapist</span>
              <div className="bg-teal-500 w-8 h-8 flex items-center justify-center text-white font-bold rounded-full text-sm">
                {totalTherapists}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Conditional Rendering */}
      {isPatientDetailView && selectedPatient && selectedTherapist ? (
        <PatientDetail
          patient={selectedPatient}
          therapist={selectedTherapist}
          onBackToTherapist={handleBackToTherapist}
        />
      ) : isTherapistDetailView && selectedTherapist ? (
        <TherapistDetail
          therapist={selectedTherapist}
          onBack={handleBackToList}
          setIsEditModalOpen={openEditModal}
          onViewPatientDetails={handleViewPatientDetails} // Pass the handler
        />
      ) : (
        /* Therapist Card Grid - Show only in list view */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTherapists.map((therapist) => (
            <TherapistCard
              key={therapist.id}
              therapist={therapist}
              setSelectedTherapist={setSelectedTherapistId}
            />
          ))}

          {filteredTherapists.length === 0 && (
            <div className="lg:col-span-3 xl:col-span-4 text-center py-10 text-gray-500">
              No therapists match your current search or filter.
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Therapist Modal */}
      <AddTherapistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        // onSave={handleAddTherapist}
        isEditMode={isEditMode}
      />
    </div>
  );
};

export default App;
