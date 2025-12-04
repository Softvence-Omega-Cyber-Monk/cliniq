import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useUserId } from "@/hooks/useUserId";
import { useCreateAppointmentMutation } from "@/store/api/AppoinmentsApi";
import { toast } from "sonner";
import { useGetAllClinicClientsQuery } from "@/store/api/ClinicClientsApi";
import { useAppSelector } from "@/hooks/useRedux";
import { useGetAllClientQuery } from "@/store/api/ClientsApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { useGetTherapistByClinicQuery } from "@/store/api/UsersApi";

interface ScheduleModalProps {
  onClose: () => void;
}

interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  sessionCount: number;
  overallProgress: number;
  status: string;
}

interface Therapist {
  id: string;
  fullName: string;
  email: string;
  speciality?: string;
}
const ScheduleModal: React.FC<ScheduleModalProps> = ({ onClose }) => {
  const userType = useAppSelector((state) => state.auth.userType);
  const userId = useUserId();
  const [selectedTherapistId, setSelectedTherapistId] = useState(
    userType === "THERAPIST" || userType === "INDIVIDUAL_THERAPIST"
      ? userId
      : ""
  );
  const [createAppointment, { isLoading: isCreating }] =
    useCreateAppointmentMutation();
  const { data: therapistsData } = useGetTherapistByClinicQuery(
    userId ? { id: userId, search: "", status: "" } : skipToken
  );
  const therapistQuery = useGetAllClientQuery(
    userType === "THERAPIST" || userType === "INDIVIDUAL_THERAPIST"
      ? {
          therapistId: userId,
          search: "",
          status: "",
        }
      : skipToken
  );
  const clinicQuery = useGetAllClinicClientsQuery(
    userType === "CLINIC"
      ? {
          clinicId: userId,
          search: "",
          status: "",
        }
      : skipToken
  );

  // Select the active query
  const clientsData =
    userType === "THERAPIST" || userType === "INDIVIDUAL_THERAPIST"
      ? therapistQuery.data
      : clinicQuery.data;

  const [selectedClientId, setSelectedClientId] = useState("");

  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [duration, setDuration] = useState(60);
  const [sessionType, setSessionType] = useState("virtual");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  // Update phone/email whenever selected client changes
  useEffect(() => {
    if (!selectedClientId || !clientsData?.data) return;

    const client = clientsData.data.find(
      (c: Client) => c.id === selectedClientId
    );
    if (client) {
      setEmail(client.email || "");
      setPhone(client.phone || "");
    } else {
      setEmail("");
      setPhone("");
    }
  }, [selectedClientId, clientsData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !selectedClientId ||
      !userId ||
      !scheduledDate ||
      !scheduledTime ||
      !duration ||
      !sessionType ||
      !phone ||
      !email
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      clientId: selectedClientId,
      therapistId: userType === "CLINIC" ? selectedTherapistId : userId,
      scheduledDate,
      scheduledTime,
      duration,
      sessionType,
      phone,
      email,
      notes,
    };

    try {
      await createAppointment(payload).unwrap();
      toast.success("Appointment created successfully!");
      onClose();
    } catch (err) {
      console.error("Error creating appointment:", err);
      toast.error("Failed to create appointment.");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-[#FAFAF7]/50 flex items-center justify-center backdrop-blur-[1px] z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#ebf4f2] p-10 rounded-2xl  w-full max-w-[695px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className=" border-b border-gray-100 flex justify-between items-center mb-5">
          <h2 className="text-xl font-medium text-gray-800">
            Schedule New Appointment
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <form className=" space-y-4" onSubmit={handleSubmit}>
          {/* Therapist Select - Only show for CLINIC users */}
          {userType === "CLINIC" && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Therapist
              </label>
              <select
                value={selectedTherapistId}
                onChange={(e) => setSelectedTherapistId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-mint-500 focus:border-mint-500 transition duration-150 text-gray-800 bg-white shadow-inner"
              >
                <option value="">Select Therapist</option>
                {therapistsData?.data?.map((t: Therapist) => (
                  <option key={t.id} value={t.id}>
                    {t.fullName} ({t.email})
                  </option>
                ))}
              </select>
            </div>
          )}
          {/* Client Select */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client
            </label>
            <select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value)}
              className="w-full px-4 py-3 border  rounded-xl focus:ring-mint-500 focus:border-mint-500 transition duration-150 text-gray-800 border-[#EAE9DD] bg-[#FAFAF7]"
            >
              <option value="">Select Client</option>
              {clientsData?.data?.map((c: Client) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-4 py-3 border  rounded-xl focus:ring-mint-500 focus:border-mint-500 transition duration-150 text-gray-800 border-[#EAE9DD] bg-[#FAFAF7]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full px-4 py-3 border  rounded-xl focus:ring-mint-500 focus:border-mint-500 transition duration-150 text-gray-800 bg-[#FAFAF7] border-[#EAE9DD]"
              />
            </div>
          </div>

          <div className="flex justify-between gap-4">
            {/* Duration */}
            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <input
                type="number"
                min={15}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-4 py-3 border  rounded-xl focus:ring-mint-500 focus:border-mint-500 transition duration-150 text-gray-800 bg-[#FAFAF7]  border-[#EAE9DD]"
              />
            </div>

            {/* Session Type */}
            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Session Type
              </label>
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
                className="w-full px-4 py-3.5 border  rounded-xl focus:ring-mint-500 focus:border-mint-500 transition duration-150 text-gray-800 bg-[#FAFAF7] border-[#EAE9DD]"
              >
                <option value="virtual">Virtual</option>
                <option value="onsite">Onsite</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            {/* Phone */}
            <div className="mb-4 flex-1 ">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1234567890"
                className="w-full px-4 py-3 border  rounded-xl focus:ring-mint-500 focus:border-mint-500 transition duration-150 text-gray-800 border-[#EAE9DD]  bg-[#FAFAF7]"
              />
            </div>

            {/* Email */}
            <div className="mb-4 flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@example.com"
                className="w-full px-4 py-3 border  rounded-xl focus:ring-mint-500 focus:border-mint-500 transition duration-150 text-gray-800 border-[#EAE9DD] bg-[#FAFAF7]"
              />
            </div>
          </div>

          {/* Notes */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Client requested early morning session"
              className="w-full px-4 py-3 border  rounded-xl focus:ring-mint-500 focus:border-mint-500 transition duration-150 text-gray-800 border-[#EAE9DD] bg-[#FAFAF7]"
            />
          </div>

          <div className="pt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 font-medium rounded-[12px] flex-1 border border-gray-950 text-gray-900 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 font-medium  rounded-[12px] flex-1 bg-mint-500 text-white bg-[#3FDCBF] transition-colors "
            >
              {isCreating ? "Scheduling..." : "Schedule Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ScheduleModal;
