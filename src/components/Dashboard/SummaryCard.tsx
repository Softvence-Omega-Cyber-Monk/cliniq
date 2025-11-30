import React from "react";

// 1. Summary Card Data

/**
 * SummaryCard Component
 */
interface SummaryCardProps {
  data: (typeof summaryCardsData)[0];
}

const SummaryCard: React.FC<SummaryCardProps> = ({ data }) => {
  const Icon = data.icon;
  return (
    <div className="bg-white p-5 rounded-2xl shadow-[0px_4px_33.1px_rgba(0,0,0,0.04)] transition">
      <div className="flex justify-between items-start mb-3">
        {/* Icon Container */}
        <div
          className={`p-2 rounded-[8px] ${data.bgColor} border border-[#E0DFCD]`}
        >
          <Icon className={`w-5 h-5 ${data.iconColor}`} />
        </div>
        {/* Percentage */}
        <div className="text-xs text-[#3FDCBF] bg-[#96C75E1A]  px-2 py-1.5 rounded-[12px]">
          {data.percent}%
        </div>
      </div>

      <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
        {data.title}
      </p>
      <p className="text-3xl font-semibold text-gray-900">{data.value}</p>
    </div>
  );
};

export default SummaryCard;
