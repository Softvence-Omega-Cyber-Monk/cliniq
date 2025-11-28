import { useAppSelector } from "@/hooks/useRedux";
import { useAddCrisisHistoryMutation } from "@/store/api/ClientsApi";
import { useAddClinicClientCrisisHistoryMutation } from "@/store/api/ClinicClientsApi";
import React, { useState } from "react";
import { toast } from "sonner";

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  clientId: string | undefined;
  therapistId: string | undefined;
}

const CrisisModal: React.FC<CrisisModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  clientId,
  therapistId,
}) => {
  const [formData, setFormData] = useState({
    description: "Client experienced severe panic attack at workplace",
    severity: "high",
    intervention: "Emergency session scheduled, breathing exercises practiced",
    outcome: "Client stabilized after 30 minutes",
  });

  const userType = useAppSelector((state) => state.auth.userType);
  const [addCrisisByClinic, { isLoading: isLoadingClinic }] =
    useAddClinicClientCrisisHistoryMutation();
  const [addCrisisByTherapist, { isLoading: isLoadingTherapist }] =
    useAddCrisisHistoryMutation();

  const isLoading =
    userType === "THERAPIST" ? isLoadingTherapist : isLoadingClinic;

  if (!isOpen) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      onSubmit(formData);

      let res;
      if (userType === "THERAPIST") {
        res = await addCrisisByTherapist({
          clientId,
          therapistId,
          crisisData: {
            crisisDate: new Date().toISOString(),
            ...formData,
          },
        });
      } else if (userType === "CLINIC") {
        res = await addCrisisByClinic({
          clientId,
          clinicId: therapistId,
          crisisData: {
            crisisDate: new Date().toISOString(),
            ...formData,
          },
        });
      }

      if (res && "data" in res && isLoading) {
        onClose();
      } else {
        toast.error("Failed to save crisis data");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to save crisis data");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 relative shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-600 hover:text-gray-800 text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-gray-800">
          Add Crisis Event
        </h2>
        <p className="text-sm text-gray-600 mt-1 max-w-md leading-relaxed">
          Fill out the details of the crisis event below.
        </p>

        <div className="grid gap-4 mt-6">
          <div className="grid gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-2xl"
            />
          </div>

          <div className="grid gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Severity
            </label>
            <select
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-2xl"
            >
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="grid gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Intervention
            </label>
            <textarea
              name="intervention"
              value={formData.intervention}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-2xl"
            />
          </div>

          <div className="grid gap-1">
            <label className="text-sm font-semibold text-gray-700">
              Outcome
            </label>
            <textarea
              name="outcome"
              value={formData.outcome}
              onChange={handleChange}
              className="w-full p-3 border border-gray-200 rounded-2xl"
            />
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`${
                isLoading
                  ? "bg-teal-300 cursor-not-allowed"
                  : "bg-teal-500 hover:bg-teal-600"
              } text-white px-6 py-3 rounded-xl font-semibold transition`}
            >
              {isLoading ? "Saving..." : "Save Crisis"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrisisModal;
