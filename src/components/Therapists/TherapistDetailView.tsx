import React from "react";
import type { Therapist, Patient } from "../Therapists/types";
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  AcademicCapIcon,
  SparklesIcon,
  ClockIcon,
  UsersIcon,
  DocumentChartBarIcon,
  CheckCircleIcon,
  XMarkIcon,
} from "../Therapists/icons";
import { InfoCard } from "@/common/InfoCard";

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="w-full bg-brand-gray-200 rounded-full h-2">
    <div
      className="bg-blue-500 h-2 rounded-full"
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

interface TherapistDetailViewProps {
  therapist: Therapist;
  patients: Patient[];
  onSelectPatient: (id: string) => void;
  onBack: () => void;
}

const TherapistDetailView: React.FC<TherapistDetailViewProps> = ({
  therapist,
  patients,
  onSelectPatient,
  onBack,
}) => {
  return (
    <div className="space-y-8">
      <div className="text-sm text-brand-gray-500">
        <span className="cursor-pointer hover:underline" onClick={onBack}>
          Therapists
        </span>
        <span className="mx-2">/</span>
        <span className="font-medium text-brand-teal">{therapist.name}</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <img
              src={therapist.avatar}
              alt={therapist.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold text-brand-gray-800">
                {therapist.name}
              </h1>
              <p className="text-brand-gray-500">{therapist.specialty}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="bg-brand-gray-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-gray-600 transition-colors">
              Suspend
            </button>
            <button className="bg-brand-red text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
              Delete
            </button>
          </div>
        </div>
        <div className="border-t border-brand-gray-200 my-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoCard
            icon={<UserIcon className="w-5 h-5" />}
            label="Full Name"
            value={therapist.name}
          />
          <InfoCard
            icon={<MailIcon className="w-5 h-5" />}
            label="Email Address"
            value={therapist.email}
          />
          <InfoCard
            icon={<PhoneIcon className="w-5 h-5" />}
            label="Phone Number"
            value={therapist.phone}
          />
          <InfoCard
            icon={<AcademicCapIcon className="w-5 h-5" />}
            label="Qualifications"
            value={therapist.qualifications}
          />
          <InfoCard
            icon={<SparklesIcon className="w-5 h-5" />}
            label="Specialty"
            value={therapist.specialty}
          />
          <InfoCard
            icon={<ClockIcon className="w-5 h-5" />}
            label="Availability"
            value={therapist.availability}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 flex justify-between items-center">
          <div>
            <p className="text-brand-gray-500">Total Patients</p>
            <p className="text-4xl font-bold text-brand-gray-800">
              {therapist.patientCount}
            </p>
          </div>
          <UsersIcon className="w-10 h-10 text-brand-teal" />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 flex justify-between items-center">
          <div>
            <p className="text-brand-gray-500">Total Sessions (L30 Days)</p>
            <p className="text-4xl font-bold text-brand-gray-800">
              {therapist.totalSessionsLast30Days}
            </p>
          </div>
          <DocumentChartBarIcon className="w-10 h-10 text-blue-500" />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 flex justify-between items-center">
          <div>
            <p className="text-brand-gray-500">Account Status</p>
            <p
              className={`text-4xl font-bold ${
                therapist.status === "active"
                  ? "text-brand-green"
                  : "text-brand-red"
              }`}
            >
              {therapist.status.charAt(0).toUpperCase() +
                therapist.status.slice(1)}
            </p>
          </div>
          {therapist.status === "active" ? (
            <CheckCircleIcon className="w-10 h-10 text-brand-green" />
          ) : (
            <XMarkIcon className="w-10 h-10 text-brand-red" />
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-brand-gray-200">
            <tr>
              <th className="p-4 font-semibold text-brand-gray-500">
                Patient Name
              </th>
              <th className="p-4 font-semibold text-brand-gray-500">
                Session Count
              </th>
              <th className="p-4 font-semibold text-brand-gray-500">
                Treatment Progress
              </th>
              <th className="p-4 font-semibold text-brand-gray-500">Status</th>
              <th className="p-4 font-semibold text-brand-gray-500">Action</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr
                key={patient.id}
                className="border-b border-brand-gray-100 last:border-b-0 hover:bg-brand-gray-50"
              >
                <td className="p-4 font-medium text-brand-gray-800">
                  {patient.name}
                </td>
                <td className="p-4 text-brand-gray-600">
                  {patient.sessionCount}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <ProgressBar progress={patient.treatmentProgress} />
                    <span className="text-sm text-brand-gray-600">
                      {patient.treatmentProgress}%
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full font-medium text-xs ${
                      patient.status === "active"
                        ? "bg-green-100 text-brand-green"
                        : "bg-red-100 text-brand-red"
                    }`}
                  >
                    {patient.status}
                  </span>
                </td>
                <td className="p-4">
                  <button
                    onClick={() => onSelectPatient(patient.id)}
                    className="border border-brand-teal text-brand-teal font-semibold py-1.5 px-4 rounded-lg hover:bg-brand-teal hover:text-white transition-colors"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TherapistDetailView;
