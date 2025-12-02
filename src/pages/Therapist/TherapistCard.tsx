import React, { Dispatch, SetStateAction } from "react";
import { useUserId } from "@/hooks/useUserId";
import { Therapist } from "./TherapistType";

interface TherapistCardProps {
  therapist: Therapist;
  setSelectedTherapist: Dispatch<SetStateAction<string | null>>;
}

const TherapistCard: React.FC<TherapistCardProps> = ({
  therapist,
  setSelectedTherapist,
}) => {
  const userId = useUserId();
  return (
    <div className="bg-white p-5 rounded-xl shadow-[0px 4px 33.099998474121094px 0px rgba(0, 0, 0, 0.04)] border border-gray-100 flex flex-col transition-shadow hover:shadow">
      {/* Name and Specialty */}
      <div className="flex items-center space-x-3 mb-4">
        <div
          className={`w-12 h-12 flex items-center justify-center text-sm font-bold text-white rounded-full bg-[#3fdcbf]`}
        >
          {therapist.fullName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {therapist.fullName}{" "}
            {therapist.id === userId && (
              <span className="text-sm font-normal text-gray-500">(ME)</span>
            )}
          </h3>
          <p className="text-sm text-gray-500">{therapist.qualification}</p>
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
      <button
        onClick={() => setSelectedTherapist(therapist.id)}
        className="w-full py-2 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition duration-150  hover:shadow cursor-pointer"
      >
        View Details
      </button>
    </div>
  );
};

export default TherapistCard;
