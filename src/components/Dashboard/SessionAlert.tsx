import React from "react";
import { AlertTriangle } from "lucide-react";
import { AssessmentAlert } from "../oldreposty/types";

// Alert Data - Fixed and complete

interface SessionAlertProps {
  data: AssessmentAlert;
}

const SessionAlert: React.FC<SessionAlertProps> = ({ data }) => {
  const isCrisis = data.severity === "high";

  const iconColor = isCrisis ? "text-[#D45B53]" : "text-[#7E8086]";
  const alertBg = isCrisis ? "bg-[#D45B530D]" : "bg-[#EBEBEC] ";
  const crisisBadge = isCrisis ? (
    <span className="ml-3 text-xs font-medium text-white bg-[#D45B53] px-2 py-1 rounded-[6px]">
      {data.severity}
    </span>
  ) : null;

  return (
    <div className={`p-5 rounded-xl ${alertBg} flex items-start space-x-4 `}>
      <AlertTriangle className={`w-5 h-5 mt-0.5 ${iconColor}`} />
      <div className="flex-1">
        <div className="flex items-center">
          <p className="font-semibold text-[#32363F]dark:text-gray-100">
            {data.clientName}
          </p>
          {crisisBadge}
        </div>
        <p className="text-sm text-[#7E8086] mt-1">{data.title}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          {data.timeAgo}
        </p>
      </div>
    </div>
  );
};

export default SessionAlert;
