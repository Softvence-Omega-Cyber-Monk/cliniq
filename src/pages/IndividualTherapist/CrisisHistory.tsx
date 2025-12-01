import React, { useState } from "react";
import { AlertTriangle, Plus } from "lucide-react";
import CrisisModal from "@/modals/CrisisModal";
import { formatToYMD } from "@/utils/formatDate";
interface Crisis {
  crisisDate: string;
  description: string;
  severity: "low" | "medium" | "high";
  intervention: string;
  outcome: string;
}
interface CrisisHistoryProps {
  crisisHistory?: Crisis[];
  clientId: string | undefined;
  therapistId: string | undefined;
  isThisTherapist?: boolean;
}
const CrisisHistory: React.FC<CrisisHistoryProps> = ({
  crisisHistory: initialCrisisHistory,
  clientId,
  therapistId,
  isThisTherapist,
}) => {
  const [crisisHistory, setCrisisHistory] = useState(
    initialCrisisHistory || []
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handler when a new crisis is submitted
  const handleAddCrisis = (newCrisis: Crisis) => {
    setCrisisHistory([newCrisis, ...crisisHistory]);
    setIsModalOpen(false);
  };

  return (
    <div className=" rounded-2xl bg-[#FAFAF7] p-6  ">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="text-orange-500" size={20} />
          <h2 className="text-lg font-bold text-[#32363F]">Crisis History</h2>
        </div>
        {isThisTherapist && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
          >
            <Plus size={16} />
            Add Crisis
          </button>
        )}
      </div>

      <div className="space-y-4">
        {crisisHistory.length === 0 && (
          <p className="text-gray-500 text-sm">No crisis events recorded.</p>
        )}

        {crisisHistory.map((crisis, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-[#D45B531A] border border-[#D45B5333]"
          >
            {/* Top row: Description + Severity Badge */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold capitalize">{crisis.description}</h3>

              <span
                className={`
          text-xs px-3 py-1 rounded-[6px] font-semibold
          ${
            crisis.severity === "high"
              ? "bg-[#D45B53] text-white"
              : crisis.severity === "medium"
              ? "bg-orange-100 text-orange-700"
              : "bg-yellow-100 text-yellow-700"
          }
        `}
              >
                {crisis.severity}
              </span>
            </div>

            {/* Date */}
            <p className="text-xs text-gray-500 mt-1">
              {formatToYMD(crisis.crisisDate)}
            </p>
            <div className="h-[1px] w-full bg-[#7e808673] mt-3"></div>
            {/* Intervention */}
            <p className="text-sm mt-3">{crisis.intervention}</p>

            {/* Outcome */}
            <p className="text-sm mt-2 font-medium">
              Outcome: {crisis.outcome}
            </p>
          </div>
        ))}
      </div>

      {/* Crisis Modal */}
      <CrisisModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCrisis}
        therapistId={therapistId}
        clientId={clientId}
      />
    </div>
  );
};

export default CrisisHistory;
