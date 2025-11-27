import { formatToYMDWithTime } from "@/utils/formatDate";
import { ChevronDown, Clock3 } from "lucide-react";
import React, { useState } from "react";

interface Session {
  sessionDate: string;
  sessionType: string;
  notes: string;
  crisis?: boolean;
}

interface SessionHistoryProps {
  sessionHistory: Session[];
}

const SessionHistory: React.FC<SessionHistoryProps> = ({ sessionHistory }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="bg-[#FAFAF7] rounded-[12px] p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">Session History</h2>
        <span className="text-sm text-gray-500">
          {sessionHistory.length} sessions
        </span>
      </div>

      <div className="space-y-3">
        {sessionHistory.map((s, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-[8px]  overflow-hidden transition-all ${
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
                    <h3 className="font-semibold">{s.sessionType}</h3>
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
