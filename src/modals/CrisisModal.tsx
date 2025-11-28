import { useAppSelector } from "@/hooks/useRedux";
import { useAddCrisisHistoryMutation } from "@/store/api/ClientsApi";
import { useAddClinicClientCrisisHistoryMutation } from "@/store/api/ClinicClientsApi";
import React, { useState } from "react";
import { toast } from "sonner";

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onSubmit: (data: {
  //   crisisDate?: string | undefined;
  //   description: string;
  //   severity: string;
  //   intervention: string;
  //   outcome: string;
  // }) => void;
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
  const [addCrisisByClinic] = useAddClinicClientCrisisHistoryMutation();
  const [addCrisisByTherapist] = useAddCrisisHistoryMutation();

  if (!isOpen) return null;
  console.log("cline:", therapistId, "client:", clientId);
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
      console.log(userType);

      let res;
      if (userType === "THERAPIST") {
        res = await addCrisisByTherapist({
          clientId,
          therapistId,
          crisisData: {
            crisisDate: new Date().toISOString(),
            description: formData.description,
            severity: formData.severity,
            intervention: formData.intervention,
            outcome: formData.outcome,
          },
        });
        console.log("Response from addCrisisByClinic:", res);
      } else if (userType === "CLINIC") {
        res = await addCrisisByClinic({
          clientId,
          clinicId: therapistId,
          crisisData: {
            crisisDate: new Date().toISOString(),
            description: formData.description,
            severity: formData.severity,
            intervention: formData.intervention,
            outcome: formData.outcome,
          },
        });
        console.log("Response from addCrisisByTherapist:", res);
      }

      // Check if the response is successful (depends on your API)
      if (res && "data" in res) {
        // Only close modal if request was successful
        onClose();
      } else {
        console.error("Failed to save crisis data:", res);
        toast.error("Failed to save crisis data");
      }
    } catch (error) {
      toast.error("Failed to save crisis data");
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 relative shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-600 hover:text-gray-800 text-xl"
        >
          ✕
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-semibold text-gray-800">
          Add Crisis Event
        </h2>
        <p className="text-sm text-gray-600 mt-1 max-w-md leading-relaxed">
          Fill out the details of the crisis event below.
        </p>

        {/* Form */}
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
              <option value="medium">Medium</option>
              <option value="high">High</option>
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
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Save Crisis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrisisModal;
