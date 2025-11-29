/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Clock,
  Briefcase,
  ChevronLeft,
  Calendar,
} from "lucide-react";
import { Therapist } from "./TherapistType";
import { 
  useGetTherapistClientTableQuery,
  useGetTherapistOverviewQuery,
} from "@/store/api/TherapistApi";
import TherapistEditModal from "@/components/Therapists/TherapistEditModal";

interface TherapistDetailProps {
  therapist: Therapist;
  onBack: () => void;
  onViewPatientDetails: (patientId: string) => void;
}

const DetailItem: React.FC<{ icon: any; label: string; value: string }> = ({
  icon: Icon,
  label,
  value,
}) => (
  <div className="flex items-start space-x-3">
    <Icon size={20} className="text-teal-500 mt-1 flex-shrink-0" />
    <div className="flex flex-col">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      <p className="text-base text-gray-800 font-semibold">{value}</p>
    </div>
  </div>
);

const DetailPatientRow: React.FC<{
  patient: any;
  onViewPatientDetails: (patientId: string) => void;
}> = ({ patient, onViewPatientDetails }) => {
  const statusClasses =
    patient.status === "Active"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  const progressBarWidth = `${patient.progressPercent}%`;

  return (
    <tr className="border-b hover:bg-gray-50 transition duration-150">
      <td className="p-4 text-gray-700 font-medium">{patient.name}</td>
      <td className="p-4 text-gray-600">{patient.sessionCount}</td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-teal-500 h-2 rounded-full"
              style={{ width: progressBarWidth }}
            />
          </div>
          <span className="text-sm text-gray-600 w-10">
            {patient.progressPercent}%
          </span>
        </div>
      </td>
      <td className="p-4">
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${statusClasses}`}
        >
          {patient.status}
        </span>
      </td>
      <td className="p-4 text-right">
        <button
          onClick={() => onViewPatientDetails(patient.id)}
          className="text-teal-500 hover:text-teal-700 text-sm font-medium px-3 py-1 border border-teal-300 rounded-lg hover:bg-teal-50 transition"
        >
          View Details
        </button>
      </td>
    </tr>
  );
};

const TherapistDetail: React.FC<TherapistDetailProps> = ({
  therapist,
  onBack,
  onViewPatientDetails,
}) => {
  // --- Edit Modal State ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // --- Therapist Clients Data ---
  const { data: clientData, refetch: refetchClients } = useGetTherapistClientTableQuery(therapist?.id);
  const therapistPatients = clientData?.data || [];

  // --- Therapist Overview Data ---
  const { data: overviewData, refetch: refetchOverview } = useGetTherapistOverviewQuery(therapist?.id);
  const overview = overviewData?.data || {};
  const totalPatients = overview.totalPatients || 0;
  const totalSessions = overview.totalSessions || 0;
  const totalAppointments = overview.totalAppointments || 0;


  // --- Therapist Status State ---
  const [currentStatus, setCurrentStatus] = useState(false);

  useEffect(() => {
    if (overviewData?.data?.accountStatus) {
      setCurrentStatus(overviewData.data.accountStatus === "active");
    }
  }, [overviewData]);

  const handleEditSuccess = () => {
    refetchClients();
    refetchOverview();
  };

  console.log("Therapist:", therapist);
  console.log("Overview Data:", overviewData);
  console.log("Current Status:", currentStatus);
  
  return (
    <div className="space-y-6">
      {/* Breadcrumbs & Back Button */}
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
        <button
          onClick={onBack}
          className="text-teal-600 hover:text-teal-800 flex items-center space-x-1 font-medium"
        >
          <ChevronLeft size={16} />
          <span>Therapists</span>
        </button>
        <span>/</span>
        <span className="font-semibold text-gray-800">
          {therapist.fullName} {therapist.initials}
        </span>
      </div>

      {/* Profile Header and Info */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex justify-between items-start border-b border-gray-200 pb-5 mb-5">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-teal-400 to-teal-600 shadow-md flex items-center justify-center text-2xl font-bold text-white">
              {therapist.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {therapist.fullName}
              </h2>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="flex items-center bg-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md hover:bg-teal-600 transition cursor-pointer"
          >
            <BookOpen size={16} className="mr-2" />
            Edit Therapist Info
          </button>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DetailItem icon={User} label="Full Name" value={therapist.fullName} />
          <DetailItem icon={Mail} label="Email Address" value={therapist.email} />
          <DetailItem icon={Phone} label="Phone Number" value={therapist.phone} />
          <DetailItem
            icon={BookOpen}
            label="Qualifications"
            value={therapist.qualification}
          />
          <DetailItem icon={Briefcase} label="Specialty" value={therapist.speciality} />
          <DetailItem
            icon={Clock}
            label="Availability"
            value={
              therapist.availableDays
                ?.map(
                  (day: string) => day.charAt(0) + day.slice(1).toLowerCase()
                )
                .join(", ") || "Not specified"
            }
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl shadow-lg flex items-center justify-between border-l-4 border-teal-500">
          <div>
            <p className="text-sm text-gray-500">Total Patients</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {totalPatients}
            </p>
          </div>
          <User size={32} className="text-teal-400 opacity-50" />
        </div>

        <div className="bg-white p-5 rounded-xl shadow-lg flex items-center justify-between border-l-4 border-purple-500">
          <div>
            <p className="text-sm text-gray-500">Total Sessions</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {totalSessions}
            </p>
          </div>
          <Clock size={32} className="text-purple-400 opacity-50" />
        </div>

        <div className="bg-white p-5 rounded-xl shadow-lg flex items-center justify-between border-l-4 border-blue-500">
          <div>
            <p className="text-sm text-gray-500">Total Appointments</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {totalAppointments}
            </p>
          </div>
          <Calendar size={32} className="text-blue-400 opacity-50" />
        </div>
      </div>

      {/* Patient Table */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Patient List</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="p-4">Patient Name</th>
                <th className="p-4">Session Count</th>
                <th className="p-4">Treatment Progress</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {therapistPatients.length > 0 ? (
                therapistPatients.map((patient: any) => (
                  <DetailPatientRow
                    key={patient.id}
                    patient={patient}
                    onViewPatientDetails={onViewPatientDetails}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No patients found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <TherapistEditModal
        therapist={therapist}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default TherapistDetail;