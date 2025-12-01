import SessionHistoryModal from "@/modals/SessionHistoryModal";
import { formatToYMDWithTime } from "@/utils/formatDate";
import { ChevronDown, Clock3 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface Session {
  sessionDate: string;
  sessionType: string;
  notes: string;
  duration: number;
  crisis?: boolean;
}

interface SessionHistoryProps {
  sessionHistory: Session[];
  addedSessionbytherapist: any;
  addClinicClientSessionHistory: any;
  clientId: string | undefined;
  therapistId: string | undefined;
  userType:
    | "THERAPIST"
    | "ADMIN"
    | "INDIVIDUAL_THERAPIST"
    | "CLINIC"
    | null
    | undefined;
  isThisTherapist?: boolean;
}

const SessionHistory: React.FC<SessionHistoryProps> = ({
  sessionHistory = [],
  addedSessionbytherapist,
  addClinicClientSessionHistory,
  clientId,
  therapistId,
  userType,
  isThisTherapist,
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [sessions, setSessions] = useState<Session[]>(sessionHistory);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const handleAddSession = async (data: Session) => {
    try {
      setSessions([...sessions, data]);
      console.log(data);

      if (userType === "THERAPIST" || userType === "INDIVIDUAL_THERAPIST") {
        await addedSessionbytherapist({
          clientId,
          therapistId,
          data: {
            sessionDate: new Date().toISOString(),
            sessionType: data.sessionType,
            duration: data.duration,
            notes: data.notes,
          },
        }).unwrap();
      } else {
        await addClinicClientSessionHistory({
          clientId,
          clinicId: therapistId, // if this is actually clinicId
          sessionData: {
            sessionDate: new Date().toISOString(),
            sessionType: data.sessionType,
            duration: data.duration,
            notes: data.notes,
          },
        }).unwrap();
      }
      toast.success("Session added successfully!");
      // Success feedback
    } catch (error: any) {
      console.error("Error adding session:", error);

      // Optionally, rollback the optimistic update
      setSessions(sessions);
    }
  };

  return (
    <div className="bg-[#FAFAF7] rounded-[12px] p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg text-[#32363F] font-bold">Session History</h2>
        <span className="text-sm text-gray-500">
          {sessions.length} sessions
        </span>
        {isThisTherapist && (
          <div className="mt-4">
            <SessionHistoryModal onSubmit={handleAddSession} />
          </div>
        )}
      </div>

      <div className="space-y-3">
        {sessions.map((s, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-[8px] overflow-hidden transition-all ${
                s.crisis
                  ? "bg-red-50 border-red-200"
                  : "bg-white border-gray-200"
              }`}
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full flex justify-between items-center p-4 focus:outline-none"
              >
                <div className="flex gap-3">
                  <div className="bg-[#96C75E1A] flex items-center justify-center size-11 rounded-full text-[#3FDCBF]">
                    <Clock3 size={18} />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold capitalize text-[#32363F]">
                      {s.sessionType}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {formatToYMDWithTime(s.sessionDate)}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  size={18}
                  className={`transform transition-transform ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 text-sm text-gray-700">
                  <p className="mt-2">{s.notes}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Duration: {s.duration} minutes
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SessionHistory;
