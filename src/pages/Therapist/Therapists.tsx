import { useUserId } from "@/hooks/useUserId";
import { useGetTherapistByClinicQuery } from "@/store/api/UsersApi";
import { ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import { Therapist } from "./TherapistType";
import TherapistCardSkeleton from "@/components/Skeleton/TherapistCardSkeleton";
import { Link } from "react-router-dom";

export default function Therapists() {
  const userId = useUserId();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "All" | "Active" | "Inactive"
  >("All");

  const { data: therapistData, isLoading } = useGetTherapistByClinicQuery({
    id: userId,
    search: searchTerm,
    status: filterStatus,
  });
  return (
    <div className="min-h-[calc(100vh-105px)] bg-[#f3f3ec] p-4 sm:p-8 ">
      <div>
        {" "}
        <h1 className="text-3xl font-semibold text-[#32363F] tracking-tight">
          THERAPISTS{" "}
        </h1>{" "}
        <p className="text-gray-500 text-sm mt-1">
          Manage therapists in your practice.{" "}
        </p>{" "}
      </div>
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
            className="w-full py-3 pl-10 pr-4 border bg-[#ffffff] border-gray-200 rounded-xl focus:ring-teal-500 focus:border-teal-500 transition shadow-sm"
          />
        </div>

        <div className="relative w-full sm:w-1/3 lg:w-1/6">
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as "All" | "Active" | "Inactive")
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
            {therapistData?.meta.total || 0}
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <TherapistCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {therapistData.data.map((therapist: Therapist) => (
            <div className="bg-white p-5 rounded-xl shadow-[0px 4px 33.099998474121094px 0px rgba(0, 0, 0, 0.04)] border border-gray-100 flex flex-col transition-shadow hover:shadow">
              {/* Name and Specialty */}
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className={`w-12 h-12 flex items-center justify-center text-sm font-bold text-white rounded-full bg-[#3fdcbf]`}
                >
                  {therapist.fullName
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {therapist.fullName}{" "}
                    {therapist.id === userId && (
                      <span className="text-sm font-normal text-gray-500">
                        (ME)
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {therapist.qualification}
                  </p>
                </div>
              </div>

              {/* Status and Patients */}
              <div className="flex justify-between items-center mb-5 border-t border-gray-300 pt-4">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 mb-1">Status</span>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full bg-green-200`}
                  >
                    {therapist.status ? therapist.status : "Active"}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm text-gray-500 mb-1">Patients</span>
                  <span className="text-2xl font-bold text-gray-800">
                    {therapist._count.clients}
                  </span>
                </div>
              </div>

              {/* View Details Button */}
              <Link
                to={`/private-practice-admin/therapists/${therapist.id}`}
                className="w-full text-center py-2 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition duration-150  hover:shadow cursor-pointer"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React, { useState, useMemo, useEffect } from "react";
// import { Search, ChevronDown, Plus } from "lucide-react";
// import { useGetTherapistByClinicQuery } from "@/store/api/UsersApi";
// import { useUserId } from "@/hooks/useUserId";
// import { Patient, Therapist } from "./TherapistType";
// import TherapistCard from "./TherapistCard";
// import PatientDetail from "./PatientDetail";
// import TherapistDetail from "./TherapistDetail";
// import {
//   useGetTherapistClientDetailsQuery,
//   useGetTherapistClientTableQuery,
// } from "@/store/api/TherapistApi";
// import { Spinner } from "@/components/ui/spinner";
// import EditPersonalInfo from "@/components/IndividualDashboard/EditPersonalInfo";

// const App: React.FC = () => {
//   const userId = useUserId();
//   const [selectedTherapistId, setSelectedTherapistId] = useState<string | null>(
//     null
//   );
//   const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
//     null
//   );
//   const { data, isLoading } = useGetTherapistByClinicQuery(userId);
//   const handleCloseModal = () => setIsModalOpen(false);
//   const { data: patientData } = useGetTherapistClientTableQuery(
//     selectedTherapistId,
//     { skip: !selectedTherapistId }
//   );
//   const { data: patientDetails, isLoading: patientDetailsLoading } =
//     useGetTherapistClientDetailsQuery(
//       { therapistId: selectedTherapistId, clientId: selectedPatientId },
//       { skip: !selectedTherapistId || !selectedPatientId }
//     );

//   const therapistData = data?.data || [];
//   const [therapists, setTherapist] = useState<Therapist[]>(therapistData);
//   useEffect(() => {
//     if (data?.data) {
//       setTherapist(data.data);
//     }
//   }, [data]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState<
//     "All" | "Active" | "Inactive"
//   >("All");
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [_isEditMode, setIsEditMode] = useState(false);

//   const filteredTherapists = useMemo(() => {
//     return therapists.filter((therapist) => {
//       const matchesSearch =
//         searchTerm.trim() === "" ||
//         therapist?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         therapist?.specialty?.toLowerCase().includes(searchTerm.toLowerCase());

//       const matchesStatus =
//         filterStatus === "All" || therapist.status === filterStatus;

//       return matchesSearch && matchesStatus;
//     });
//   }, [searchTerm, filterStatus, therapists]);
//   if (isLoading)
//     return (
//       <div className=" min-h-screen  flex justify-center items-center">
//         Loading...
//       </div>
//     );
//   if (patientDetailsLoading)
//     return (
//       <div>
//         <Spinner />
//       </div>
//     );

//   const openAddModal = () => {
//     setIsEditMode(false);
//     setIsModalOpen(true);
//   };

//   const handleViewPatientDetails = (patientId: string) => {
//     setSelectedPatientId(patientId);
//   };

//   const handleBackToTherapist = () => {
//     setSelectedPatientId(null);
//   };

//   const handleBackToList = () => {
//     setSelectedTherapistId(null);
//     setSelectedPatientId(null);
//   };

//   const totalTherapists = filteredTherapists.length;
//   const selectedTherapist = therapists.find(
//     (t) => t.id === selectedTherapistId
//   );
//   const selectedPatient = patientData?.data?.find(
//     (p: Patient) => p.id === selectedPatientId!
//   );
//   const isListView = selectedTherapistId === null || !selectedTherapist;
//   const isTherapistDetailView = !isListView && selectedPatientId === null;
//   const isPatientDetailView =
//     selectedPatientId !== null && selectedPatient && selectedTherapist;

//   return (
//     <div className="min-h-screen bg-[#f3f3ec] p-4 sm:p-8 ">
//       {/* List Header and Controls - Show only in list view */}
//       {isListView && (
//         <>
//           <header className="flex justify-between items-start mb-8">
//             <div>
//               <h1 className="text-3xl font-semibold text-[#32363F] tracking-tight">
//                 THERAPISTS
//               </h1>
//               <p className="text-gray-500 text-sm mt-1">
//                 Manage therapists in your practice.
//               </p>
//             </div>
//             <button
//               onClick={openAddModal}
//               className="cursor-pointer flex items-center bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg hover:bg-gray-700 transition"
//             >
//               <Plus size={16} className="mr-2" />
//               Add New Therapist
//             </button>
//           </header>
//           {/* Controls: Search, Filter, Count */}
//           <div className="flex flex-col lg:flex-row gap-4 mb-8 items-stretch">
//             <div className="relative flex-grow lg:w-1/3">
//               <Search
//                 size={20}
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//               />
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full py-3 pl-10 pr-4 border bg-[#ffffff] border-gray-200 rounded-xl focus:ring-teal-500 focus:border-teal-500 transition shadow-sm"
//               />
//             </div>

//             <div className="relative w-full sm:w-1/3 lg:w-1/6">
//               <select
//                 value={filterStatus}
//                 onChange={(e) =>
//                   setFilterStatus(
//                     e.target.value as "All" | "Active" | "Inactive"
//                   )
//                 }
//                 className="appearance-none w-full py-3 pl-4 pr-10 border border-gray-200 rounded-xl bg-white focus:ring-teal-500 focus:border-teal-500 transition shadow-sm cursor-pointer"
//               >
//                 <option value="All">All Status</option>
//                 <option value="Active">Active</option>
//                 <option value="Inactive">Inactive</option>
//               </select>
//               <ChevronDown
//                 size={16}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
//               />
//             </div>

//             <div className="bg-green-50 p-3 rounded-xl flex items-center justify-between shadow-sm lg:w-1/6 min-w-[150px]">
//               <span className="text-gray-700 font-medium">Total Therapist</span>
//               <div className="bg-teal-500 w-8 h-8 flex items-center justify-center text-white font-bold rounded-full text-sm">
//                 {totalTherapists}
//               </div>
//             </div>
//           </div>
//         </>
//       )}

//       {/* Conditional Rendering */}
//       {isPatientDetailView && selectedPatient && selectedTherapist ? (
//         <PatientDetail
//           patient={patientDetails}
//           therapist={selectedTherapist}
//           onBackToTherapist={handleBackToTherapist}
//         />
//       ) : isTherapistDetailView && selectedTherapist ? (
//         <TherapistDetail
//           therapist={selectedTherapist}
//           onBack={handleBackToList}
//           onViewPatientDetails={handleViewPatientDetails} // Pass the handler
//         />
//       ) : (
//         /* Therapist Card Grid - Show only in list view */
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {filteredTherapists.map((therapist) => (
//             <TherapistCard
//               key={therapist.id}
//               therapist={therapist}
//               setSelectedTherapist={setSelectedTherapistId}
//             />
//           ))}

//           {filteredTherapists.length === 0 && (
//             <div className="lg:col-span-3 xl:col-span-4 text-center py-10 text-gray-500">
//               No therapists match your current search or filter.
//             </div>
//           )}
//         </div>
//       )}

//       <EditPersonalInfo isOpen={isModalOpen} onClose={handleCloseModal} />
//     </div>
//   );
// };

// export default App;
